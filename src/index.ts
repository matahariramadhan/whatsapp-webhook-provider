import ChatBot from "./chat";
import chat_completion from "./ai";

const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

interface ChatSession {
  user: string;
  messages: {
    role: string;
    content: string;
  }[];
}

const index = async () => {
  const chatBot = await ChatBot.build();

  // const client = chatBot.client;
  chatBot.handleMessage(async (message) => {
    let chatSession = chatBot.chatSession.get(message.from);
    if (!chatSession) {
      chatSession = {
        user: message.from,
        messages: [],
      };
      chatBot.chatSession.set(message.from, chatSession);
    }
    chatSession.messages.push({ role: "user", content: message.body });

    const res = await chat_completion(chatSession.messages);

    if (res?.content) {
      chatSession.messages.push({ role: "assistant", content: res.content });
    }

    console.log(chatSession.messages);

    if (res?.content) {
      message.reply(res.content);
    }
  });

  await chatBot.listen();
};

index();
