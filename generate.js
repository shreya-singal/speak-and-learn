// Vercel serverless function. Set ANTHROPIC_API_KEY in the project's environment variables.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { prompt } = req.body || {};
  if (typeof prompt !== "string" || prompt.length > 6000) return res.status(400).json({ error: "bad prompt" });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await r.json();
  const text = (data.content || []).map((c) => c.text || "").join("");
  try {
    res.status(200).json(JSON.parse(text.replace(/```json|```/g, "").trim()));
  } catch (e) {
    res.status(502).json({ error: "bad model output" });
  }
}
