import { NodeStates, type INode } from "@/types/types";
import updateNodeStateIfConnected from "../updateNodeStateIfConnected";
import { interpolate } from "./main";
import { sendMail } from "@/services/sendMail";

async function executeEmail(
  {
    emailFieldData,
    subjectRaw,
    toEmailRaw,
    htmlMailRaw,
    emailCredentials,
    headerData,
  }: {
    emailFieldData: Record<string, any>;
    subjectRaw: string;
    toEmailRaw: string;
    htmlMailRaw: string;
    emailCredentials: Record<string, any>;
    headerData: Record<string, any>;
  },
  workflowId: string,
  node: INode
) {
  const headerAndPrevData = {
    ...emailFieldData.previousNodesData,
    ...headerData,
  };

  const subject = interpolate(subjectRaw || "", headerAndPrevData);
  const toEmail = interpolate(toEmailRaw || "", headerAndPrevData);
  const htmlMail = interpolate(htmlMailRaw || "", headerAndPrevData);
  const fromEmail = emailCredentials?.data?.email;
  const resendApiKey = emailCredentials?.data?.api;

  // console.log("Checking email data :", {
  //   subject: subject,
  //   toEmail: toEmail,
  //   htmlMail: htmlMail,
  //   emailCredentials: emailCredentials,
  //   headerData: headerData,
  //   fromEmail: fromEmail,
  //   resendApiKey: resendApiKey,
  // });

  if (!emailCredentials || !resendApiKey || !fromEmail) {
    const message = "No credentials found";
    updateNodeStateIfConnected({
      workflowId,
      node,
      nodeState: NodeStates.Failed,
      message: message,
    });
    return {
      success: false,
      passingData: {},
      message: message,
    };
  }

  const { success, message: mailMessage } = await sendMail({
    // from: fromEmail, // Currently using default email because of resend restrictions
    to: toEmail,
    subject: subject,
    htmlMail: htmlMail,
    resendApi: resendApiKey,
  });
  console.log("Checking send mail response : ", success, mailMessage);
  if (success === false) {
    updateNodeStateIfConnected({
      workflowId,
      node,
      nodeState: NodeStates.Failed,
      message: mailMessage,
    });
    return { success: false, passingData: {}, message: mailMessage };
  }

  updateNodeStateIfConnected({
    workflowId,
    node,
    nodeState: NodeStates.Completed,
  });

  return undefined;
}

export default executeEmail;
