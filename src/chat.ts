import { Message, Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

interface ChatSession {
  createdAt: number;
  messages: Message[];
}

type UserSession = Map<string, ChatSession>;

class ChatBot {
  client: Client;
  private userSession: UserSession;
  private messageHandler: (message: Message[]) => Promise<string>;

  constructor(client: Client) {
    this.userSession = new Map();
    this.client = client;
    this.messageHandler = () => new Promise(() => "");
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

  registerMessageHandler(
    messageHandler: (message: Message[]) => Promise<string>
  ) {
    this.messageHandler = messageHandler;
  }

  private async sendTypingStatus(from: string) {
    const chat = await this.client.getChatById(from);
    await chat.sendStateTyping();
  }

  private async handleMessage(
    message: Message,
    chatSession: ChatSession
  ): Promise<Message> {
    await this.sendTypingStatus(message.from);
    const res = await this.messageHandler(chatSession.messages);
    return await message.reply(res);
  }

  private createNewSession(sessionId: string) {
    this.userSession.set(sessionId, {
      createdAt: Date.now(),
      messages: [],
    });
  }

  private async handleSession(message: Message) {
    const sessionId = message.from;
    if (!this.userSession.get(sessionId)) {
      this.createNewSession(sessionId);
    }

    let chatSession = this.userSession.get(sessionId);
    if (!chatSession) {
      throw new Error(`Chat messages are ${chatSession}`);
    }
    chatSession.messages.push(message);

    const replyMessage = await this.handleMessage(message, chatSession);

    chatSession.messages.push(replyMessage);
    this.userSession.set(message.from, chatSession);
  }

  async listen() {
    this.client.on("message", async (message) => {
      await this.handleSession(message);

      // check usersession
      console.log(this.userSession.get(message.from));
    });
    await this.client.initialize();
  }
}

export default ChatBot;
