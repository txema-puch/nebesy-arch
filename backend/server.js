import express from 'express';
import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

const app = express();
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt) {
  const body = {
    model: 'gpt-4o',
    messages: [
      {role: 'system', content: 'Eres un asistente que resume propuestas de infraestructura verde. Responde en JSON.'},
      {role: 'user', content: prompt}
    ],
    temperature: 0.7
  };

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });
  const data = await resp.json();
  const text = data.choices[0].message.content;
  return JSON.parse(text);
}

app.post('/api/design', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'no text' });
  try {
    const prompt = `Analiza la siguiente descripcion de diseño de infraestructura verde y responde unicamente con un JSON con las siguientes propiedades: solution_type, elements (lista corta), area_m2, water_retention_mm, co2_capture_kg. Descripcion: ${text}`;
    const design = await callOpenAI(prompt);
    // crea geometria simple para cada elemento
    const geometry = design.elements.map((el, idx) => ({
      type: el,
      position: [idx * 2, 0, 0],
      size: [1, 1, 1]
    }));
    res.json({ design, geometry });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'openai error', detail: e.message });
  }
});

app.use(express.static('../frontend/dist'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on', PORT));
