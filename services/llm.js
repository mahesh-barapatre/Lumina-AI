const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // keep in .env
});

async function parseIntent(text) {
  try {
    const prompt = `
You are a Discord assistant. Parse the user's text into a strict JSON with:
- action: "remind", "meet", or "unknown"
- args: object with relevant fields (e.g., text, time)
If you can't understand, return { "action": "unknown", "args": {} }.

User text: """${text}"""
Return ONLY JSON.
`;
    console.log(text, "this is the text");

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });
    console.log(response.text);
    const raw = response.text;
    const cleaned = raw
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    // console.log(cleaned);
    // console.log(JSON.parse(cleaned));
    try {
      return JSON.parse(cleaned);
    } catch {
      return { action: "unknown", args: {} };
    }
  } catch (err) {
    console.error("LLM error:", err);
    return { action: "unknown", args: {} };
  }
}

module.exports = { parseIntent };
