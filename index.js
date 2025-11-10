export default async function handler(req, res) {
  // 🔑 1. Обработка preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // 🔒 2. Только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Только POST-запросы разрешены' });
  }

  try {
    // 📥 Читаем тело как текст (важно для base64)
    const body = await req.text();

    // 🔄 Отправляем в Google Apps Script
    const googleResponse = await fetch('https://script.google.com/macros/s/AKfycbyUmk8zcO3cy8SY75dA7erz73-7nll-dO0mvoCvu_LXn3VMoRXsZtCRc55m6nfOwQZT/exec', {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'application/json'
      },
      body: body
    });

    // 📤 Пересылаем ответ с CORS
    const googleText = await googleResponse.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(googleResponse.status).send(googleText);

  } catch (error) {
    console.error('Vercel Proxy Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Ошибка прокси' });
  }
}