import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateText({ system, user }) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: system || "You are a helpful assistant." },
      { role: "user", content: user },
    ],
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content?.trim() || "";
}
