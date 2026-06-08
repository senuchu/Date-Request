export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const BIN_ID = process.env.JSONBIN_ID;
  const API_KEY = process.env.JSONBIN_KEY;

  const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: { 'X-Master-Key': API_KEY }
  });
  const getData = await getRes.json();
  const responses = getData.record?.responses || [];

  const rows = responses.length === 0
    ? '<p class="empty">No responses yet 🌸 Share your link!</p>'
    : responses.reverse().map(r => `
      <div class="card">
        <div class="badge ${r.answer === 'yes' ? 'yes' : 'no'}">${r.answer === 'yes' ? '💕 Said YES!' : '🙈 Maybe later'}</div>
        <div class="time">📍 ${r.receivedAt}</div>
        ${r.answer === 'yes' ? `
          <div class="row"><span>🗓️ Date</span><strong>${r.date}</strong></div>
          <div class="row"><span>🕐 Time</span><strong>${r.time}</strong></div>
          <div class="row"><span>🍽️ Food</span><strong>${r.food}</strong></div>
          <div class="row"><span>✨ Activity</span><strong>${r.activity}</strong></div>
        ` : ''}
      </div>
    `).join('');

  res.setHeader('Content-Type', 'text/html');
  return res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Admin 🌸</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;font-family:Georgia,serif;}
    body{background:#fce4ec;min-height:100vh;padding:2rem 1rem;}
    h1{text-align:center;color:#c2185b;font-size:1.5rem;margin-bottom:0.3rem;}
    .sub{text-align:center;color:#e91e8c;font-size:0.85rem;margin-bottom:0.5rem;}
    .count{text-align:center;font-size:0.8rem;color:#f48fb1;margin-bottom:1.5rem;}
    .card{background:white;border-radius:20px;padding:1.2rem 1.5rem;max-width:420px;margin:0 auto 1rem;border:2px solid #f8bbd0;}
    .badge{display:inline-block;border-radius:50px;padding:0.3rem 1rem;font-size:0.85rem;font-weight:700;margin-bottom:0.6rem;}
    .badge.yes{background:#fce4ec;color:#c2185b;}
    .badge.no{background:#f5f5f5;color:#999;}
    .time{font-size:0.72rem;color:#f48fb1;margin-bottom:0.8rem;}
    .row{display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;border-bottom:1px dashed #f8bbd0;font-size:0.88rem;color:#880e4f;}
    .row:last-child{border-bottom:none;}
    .row span{color:#e91e8c;font-size:0.8rem;}
    .empty{text-align:center;color:#f48fb1;margin-top:3rem;font-size:0.95rem;}
  </style>
</head>
<body>
  <h1>Date Responses 🌸</h1>
  <div class="sub">Only you can see this page 💕</div>
  <div class="count">${responses.length} response${responses.length !== 1 ? 's' : ''} total</div>
  ${rows}
</body>
</html>`);
}
