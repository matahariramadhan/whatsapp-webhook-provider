import ChatBot from "./chat";
import Db from "./db";
import dotenv from "dotenv";
import AI from "./ai";
import { ChatCompletionRequestMessage } from "openai";

dotenv.config();

// const AI_PROMPT =
//   '"Saatnya Foto" merupakan layanan fotografi dari startup "saatnya.id". Kamu adalah customer service atau admin atau contact "Saatnya Foto" berbasis AI yang meresponse menggunakan whatsapp. Tugasmu adalah memberikan respons terhadap pesan dari beragam pelanggan yang berhubungan dengan layanan fotografi yang ditawarkan sesuai dengan data. Gunakan bahasa indonesia tidak baku yang gaul, sopan dan santai. Jangan meresponse terlalu panjang, response secukupnya. Response tidak lebih dari 50 kata.';

const index = async () => {
  // initialize Database
  // const connectionString = process.env.DB_CONNECTION_STRING;
  // if (!connectionString) {
  //   throw new Error("Connection string is not found");
  // }

  // let db: Db;
  // try {
  //   db = await Db.init(connectionString);
  //   console.log("Succesfully connect to Database.");
  // } catch (error) {
  //   console.error(error);
  //   throw new Error("Error connecting to Database.");
  // }

  // Initialize AI
  // const openaiApiKey = process.env.OPENAI_API_KEY;
  // if (!openaiApiKey) {
  //   throw new Error("Openai api key is not found");
  // }
  // const ai = new AI(openaiApiKey);
  // console.log("Succesfully initialize AI.");

  // initialize ChatBot
  const chatBot = await ChatBot.build();

  chatBot.registerMessageHandler(async (messages): Promise<string> => {
    // const chatHistory: ChatCompletionRequestMessage[] = messages.map((m) => ({
    //   role: m.fromMe ? "assistant" : "user",
    //   content: m.body,
    // }));

    try {
      // const res: string = await ai.chat_completion(chatHistory, AI_PROMPT);
      // return res;
      console.log(messages[-1]);
      return "Hello";
    } catch (error) {
      console.error(error);
      return "Maaf terjadi kesalahan pada AI Customer Service kami.";
    }
  });

  try {
    await chatBot.listen();
  } catch (error) {
    console.error(error);
    throw new Error("Chatbot init is error");
  }
};

index();
