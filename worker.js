export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/search') {
      const q = (url.searchParams.get('q') || '').trim();
      if (!q) {
        return json({ ok: false, error: 'Informe uma busca em ?q=' }, 400);
      }

      const key = env.SERPAPI_KEY;
      if (!key) {
        return json({ ok: true, mode: 'demo', query: q, results: [], message: 'SERPAPI_KEY não configurada no Worker.' });
      }

      try {
        const api = new URL('https://serpapi.com/search');
        api.searchParams.set('engine', 'google');
        api.searchParams.set('q', q);
        api.searchParams.set('hl', 'pt-br');
        api.searchParams.set('gl', 'br');
        api.searchParams.set('api_key', key);

        const response = await fetch(api.toString(), {
          headers: { 'Accept': 'application/json' }
        });

        const data = await response.json();
        if (!response.ok) {
          return json({ ok: false, error: data?.error || `SerpApi HTTP ${response.status}` }, 502);
        }

        const results = Array.isArray(data.organic_results)
          ? data.organic_results.slice(0, 10).map(item => ({
              title: item.title || '',
              link: item.link || '',
              snippet: item.snippet || '',
              price: item.price || item.extracted_price || null,
              source: item.source || ''
            }))
          : [];

        return json({ ok: true, mode: 'live', query: q, results });
      } catch (error) {
        return json({ ok: false, error: error?.message || 'Erro ao consultar a busca.' }, 502);
      }
    }

    // Serves index.html and any other static assets from the repository.
    return env.ASSETS.fetch(request);
  }
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=UTF-8',
      'cache-control': 'no-store'
    }
  });
}
