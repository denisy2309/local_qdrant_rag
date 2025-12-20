import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const KEY_MAP = {
  default: process.env.ELEVEN_DEFAULT,
  arabic: process.env.ELEVEN_ARABIC
};

app.post("/tts/stream", async (req, res) => {
  const { text, language, voiceId } = req.body;

  const isArabicGroup =
    language.startsWith("ar") ||
    language.startsWith("ru") ||
    language.startsWith("uk");

  const apiKey = isArabicGroup
    ? KEY_MAP.arabic
    : KEY_MAP.default;

  const elevenRes = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2"
      })
    }
  );

  if (!elevenRes.ok) {
    return res.status(elevenRes.status).send("ElevenLabs error");
  }

  res.setHeader("Content-Type", "audio/mpeg");
  elevenRes.body.pipe(res);
});

app.listen(3000, () =>
  console.log("TTS backend running on http://localhost:3000")
);
