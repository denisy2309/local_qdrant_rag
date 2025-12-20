import express from "express";
import fetch from "node-fetch";
import cors from 'cors';

const app = express();
app.use(cors({
    origin: 'https://denisy2309.github.io'
}));

app.use(express.json());

const KEY_MAP = {
  default:'sk_1c4cc404e842f094fd08f742cb333cd8314028a00015d038',
  arabic:'sk_2bd9cfde9a9661d021c0e8a40fc0537e54a1169a6fa0bf00'
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
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2"
      })
    }
  );
  
  console.log("ElevenLabs status:", elevenRes.status);

  if (!elevenRes.ok) {
    return res.status(elevenRes.status).send("ElevenLabs error");
  }

  res.setHeader("Content-Type", "audio/mpeg");
  elevenRes.body.pipe(res);
});

app.listen(3000, () =>
  console.log("TTS backend running on http://localhost:3000")
);
