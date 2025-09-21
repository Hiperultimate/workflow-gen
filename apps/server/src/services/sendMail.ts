import { Resend } from "resend";

export async function sendMail({
  from,
  to,
  subject,
  htmlMail,
  resendApi,
}: {
  from?: string;
  to: string;
  subject: string;
  htmlMail: string;
  resendApi: string;
}) {
  const resend = new Resend(resendApi);

  const response = await resend.emails.send({
    from: from || "onboarding@resend.dev", // Currently just sending the mail
    to: to,
    subject: subject,
    html: htmlMail,
  });

  if (response.error) {
    return {
      success: false,
      message: response.error.message,
    };
  }

  return { success: true, message: "Success" };
}
