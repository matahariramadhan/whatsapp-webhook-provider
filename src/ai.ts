import {
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
  Configuration,
  OpenAIApi,
} from "openai";

class AI {
  openai: OpenAIApi;
  constructor(apiKey: string) {
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat_completion(
    chat_history: ChatCompletionRequestMessage[],
    prompt: string
  ): Promise<string> {
    const messages: ChatCompletionRequestMessage[] = [
      { role: "system", content: prompt },
      ...chat_history,
    ];

    let response;
    try {
      response = await this.openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 1,
      });
    } catch (error) {
      console.log(error);
      throw new Error("Error making request to openai");
    }

    // validate response
    if (!response.data.choices[0].message) {
      throw new Error("No response message from openai");
    }
    if (!response.data.choices[0].message.content) {
      throw new Error("No response content from openai");
    }
    return response.data.choices[0].message.content;
  }
}

export default AI;
