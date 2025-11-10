export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // CORS headers для всех ответов
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Обработка OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Только POST-запросы разрешены' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // ✅ Правильный способ для Edge: await request.text()
    const body = await request.text();

    const googleResponse = await fetch('https://script.google.com/macros/s/AKfycbyUmk8zcO3cy8SY75dA7erz73-7nll-dO0mvoCvu_LXn3VMoRXsZtCRc55m6nfOwQZT/exec', {
      method: 'POST',
      headers: {
        'Content-Type': request.headers.get('Content-Type') || 'application/json'
      },
      body: body
    });

    const googleText = await googleResponse.text();
    return new Response(googleText, {
      status: googleResponse.status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json; charset=utf-8'
      }
    });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Proxy error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}