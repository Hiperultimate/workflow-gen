import { Resend } from "resend";

export async function sendMail({
  from,
  to,
  subject,
  htmlMail,
  resendApi,
}: {
  from: string | undefined;
  to: string;
  subject: string;
  htmlMail: string;
  resendApi: string;
}) {
  const resend = new Resend(resendApi);

  try {
    await resend.emails.send({
      from: from || "onboarding@resend.dev", // Currently just sending the mail
      to: to,
      subject: subject,
      html: htmlMail,
    });
    return { success: true, message: "Success" };
  } catch (error) {
    console.log("An error occured while sending mail through Resend :", error);
    return { success: false, message: error };
  }
}
