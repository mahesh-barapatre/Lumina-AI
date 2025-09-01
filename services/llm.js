const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, // keep in .env
});

async function parseIntent(text) {
  try {
    const prompt = `
You are a Discord assistant. Parse the user's text into a strict JSON object with:
- action: one of ["remind", "reminders", "remind-cancel", "meet", "meetnow", "events", "music", "hangout", "about", "help", "unknown"]
- args: object with relevant fields depending on the action:
  - remind → { "text": string, "time": string }
  - reminders → {}
  - remind-cancel → { "id": string }
  - meet → {"when": string, "title": string}
  - meetnow → {}
  - events → {"when": string}
  - music → { "mood": string }
  - random-music -> {}
  - hangout → { "near": string, "type": string }
  - about → {}
  - help → {}
If the intent cannot be confidently understood, return:
{ "action": "unknown", "args": {} }

User text: """${text}"""
Return ONLY valid JSON (no explanations).

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
