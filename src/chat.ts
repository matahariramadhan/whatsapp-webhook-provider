import { Message, Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

interface ChatSession {
  user: string;
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}

class ChatBot {
  client: Client;
  chatSession: Map<string, ChatSession>;

  constructor(client: Client) {
    this.chatSession = new Map();
    this.client = client;
  }

  static async build(): Promise<ChatBot> {
    const client = new Client({
      authStrategy: new LocalAuth(),
    });

    client.on("qr", (qr: string) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("WhatsApp Bot is ready");
    });

    return new ChatBot(client);
  }

  handleMessage(cb: (message: Message) => Promise<void>) {
    this.client.on("message", async (message) => {
      const chat = await this.client.getChatById(message.from);
      await chat.sendStateTyping();

      await cb(message);
    });
  }

  async listen() {
    this.client.initialize();
  }
}

export default ChatBot;
