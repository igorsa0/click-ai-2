// CLICK AI — Cloudflare Worker + SerpApi
// 1) Publique este arquivo como Worker no Cloudflare.
// 2) Crie o secret SERPAPI_KEY no Worker.
// 3) O endpoint /api/search?q=... retorna resultados simplificados.

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/search') {
      return new Response(JSON.stringify({error:'Not found'}), {status:404, headers:{'content-type':'application/json; charset=utf-8'}});
    }
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({error:'Method not allowed'}), {status:405, headers:{'content-type':'application/json; charset=utf-8'}});
    }
    const q = (url.searchParams.get('q') || '').trim();
    if (!q) {
      return new Response(JSON.stringify({error:'Missing q'}), {status:400, headers:{'content-type':'application/json; charset=utf-8'}});
    }
    if (!env.SERPAPI_KEY) {
      return new Response(JSON.stringify({error:'SERPAPI_KEY is not configured'}), {status:500, headers:{'content-type':'application/json; charset=utf-8'}});
    }

    const serp = new URL('https://serpapi.com/search.json');
    serp.searchParams.set('engine','google_shopping');
    serp.searchParams.set('q',q);
    serp.searchParams.set('hl','pt-br');
    serp.searchParams.set('gl','br');
    serp.searchParams.set('api_key',env.SERPAPI_KEY);

    const upstream = await fetch(serp.toString());
    if (!upstream.ok) {
      return new Response(JSON.stringify({error:'Search provider error', status:upstream.status}), {status:502, headers:{'content-type':'application/json; charset=utf-8'}});
    }
    const data = await upstream.json();
    const results = (data.shopping_results || []).slice(0,12).map((r, i) => ({
      rank:i+1,
      title:r.title || '',
      price:r.price || '',
      source:r.source || '',
      link:r.link || '',
      snippet:r.snippet || '',
      product_id:r.product_id || ''
    }));

    return new Response(JSON.stringify({query:q, count:results.length, results}), {
      headers:{'content-type':'application/json; charset=utf-8','cache-control':'public, max-age=300'}
    });
  }
};
