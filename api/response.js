export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const BIN_ID = process.env.JSONBIN_ID;
  const API_KEY = process.env.JSONBIN_KEY;

  const { answer, date, time, food, activity } = req.body;

  // 1. fetch existing
  const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const getData = await getRes.json();
  const existing = getData.record?.responses || [];

  // 2. append new
  const newEntry = {
    id: Date.now(),
    receivedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }),
    answer,
    date: date || null,
    time: time || null,
    food: food || null,
    activity: activity || null,
  };
  existing.push(newEntry);

  // 3. save back
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': API_KEY
    },
    body: JSON.stringify({ responses: existing })
  });

  return res.status(200).json({ ok: true });
}
