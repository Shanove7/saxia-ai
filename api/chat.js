export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message required" });
  }

  try {
    const fw = await fetch(
      "https://api.fireworks.ai/inference/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.FW_API_KEY}`
        },
        body: JSON.stringify({
          model: "accounts/fireworks/models/qwen3-coder-480b-a35b-instruct",
          max_tokens: 2048,
          temperature: 0.6,
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await fw.json();

    return res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || "No response"
    });

  } catch (e) {
    return res.status(500).json({ error: "Internal error" });
  }
}
