export default async function handler(req, res) {
  // 🔑 УСТАНОВИТЬ CORS ЗАГОЛОВКИ ДЛЯ ВСЕХ ОТВЕТОВ
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обработка preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST-запросы разрешены' });
  }

  try {
    const body = await req.text();
    const googleRes = await fetch('https://script.google.com/macros/s/AKfycbyUmk8zcO3cy8SY75dA7erz73-7nll-dO0mvoCvu_LXn3VMoRXsZtCRc55m6nfOwQZT/exec', {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      },
      body: body
    });

    const text = await googleRes.text();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(googleRes.status).send(text);
  } catch (e) {
    res.status(500).json({ error: 'Proxy error', message: e.message });
  }
}