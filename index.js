const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyUmk8zcO3cy8SY75dA7erz73-7nll-dO0mvoCvu_LXn3VMoRXsZtCRc55m6nfOwQZT/exec';

export default {
  async fetch(request) {
    const { method } = request;

    // Обработка GET (для проверки)
    if (method === 'GET') {
      return new Response('Метод не разрешён. Используйте POST.', { status: 405 });
    }

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Только POST
    if (method !== 'POST') {
      return new Response('Метод не поддерживается', { status: 405 });
    }

    try {
      // 🔑 Ключевое: читаем тело как текст
      const body = await request.text();
      const contentType = request.headers.get('Content-Type') || 'application/json';

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': contentType },
        body: body,
      });

      const text = await response.text();
      return new Response(text, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
    } catch (err) {
      console.error('Worker error:', err);
      return new Response(
        JSON.stringify({ error: 'Прокси: внутренняя ошибка' }),
        {
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }
  },
};