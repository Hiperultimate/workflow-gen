import { NodeStates, type INode } from "@/types/types";
import updateNodeStateIfConnected from "../updateNodeStateIfConnected";
import { interpolate } from "./main";
import sendTelegramMessage from "@/services/sendTelegramMessage";

async function executeTelegram(
  {
    fieldData,
    headerData,
  }: {
    fieldData: Record<string, any>;
    headerData: Record<string, any>;
  },
  workflowId: string,
  node: INode
) {
  const chatIdForm = fieldData.chatId;
  const chatMessageForm = fieldData.chatMessage;
  const telegramCredentials = fieldData.selectedCred;

  const finalChatId = interpolate(chatIdForm || "", headerData);
  const finalChatMessage = interpolate(chatMessageForm || "", headerData);

  const telegramBotApi = telegramCredentials?.data?.botApi;
  const response = await sendTelegramMessage({
    chatId: finalChatId,
    message: finalChatMessage,
    telegramApi: telegramBotApi || "",
  });

  if (response.success === false) {
    updateNodeStateIfConnected({
      workflowId,
      node,
      nodeState: NodeStates.Failed,
      message: response.message,
    });
  } else {
    updateNodeStateIfConnected({
      workflowId,
      node,
      nodeState: NodeStates.Completed,
    });
  }

  return { success: response.success, passingData: {} };
}

export default executeTelegram;