import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import dotenv from "dotenv";

dotenv.config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const ai_prompt =
  '"Saatnya Foto" merupakan layanan fotografi dari startup "saatnya.id". Kamu adalah customer service atau admin "Saatnya Foto" berbasis AI. Tugasmu adalah memberikan respons terhadap pesan dari beragam pelanggan yang berhubungan dengan layanan fotografi yang ditawarkan sesuai dengan data. Gunakan bahasa indonesia tidak baku yang gaul, sopan dan santai. Jangan meresponse terlalu panjang, response secukupnya. Response tidak lebih dari 50 kata.';

const chat_completion = async (
  chat_history: ChatCompletionRequestMessage[]
): Promise<ChatCompletionResponseMessage> => {
  const messages: ChatCompletionRequestMessage[] = [
    { role: "system", content: ai_prompt },
    ...chat_history,
  ];

  let response;

  try {
    response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 1,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error making request to openai");
  }
  if (!response.data.choices[0].message) {
    throw new Error("No response from openai");
  }
  return response.data.choices[0].message;
};

export default chat_completion;
