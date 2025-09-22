import TelegramBot from "node-telegram-bot-api";

async function sendTelegramMessage({
  chatId,
  message,
  telegramApi,
}: {
  chatId: string;
  message: string;
  telegramApi: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const token = telegramApi;
    if (!token) {
      throw new Error("Telegram API token is required");
    }
    const bot = new TelegramBot(token);
    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown", // or "HTML" or omit
    });
    return { success: true, message: "Message sent successfully" };
  } catch (err: any) {
    return { success: false, message: err.message };
  }
}

export default sendTelegramMessage;
