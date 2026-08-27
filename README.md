# CLICK AI — MVP online

## Objetivo
Transformar o protótipo local em um site online com uma rota de busca automática preparada para receber uma API de pesquisa.

## Estrutura
- `index.html` — interface do CLICK AI.
- `functions/api/search.js` — endpoint `/api/search?q=...`.

## Publicação gratuita
O projeto foi preparado para Cloudflare Pages/Pages Functions. O plano gratuito do Cloudflare permite hospedar assets estáticos sem cobrança e possui uma cota gratuita para Functions. Veja a documentação oficial antes de publicar. 

## Busca automática
Sem credenciais, o endpoint funciona em `mode: demo`.

Para ativar uma busca externa estruturada, configure no ambiente:
- `GOOGLE_CSE_API_KEY`
- `GOOGLE_CSE_ID`

Não coloque a chave dentro do `index.html`.

## Importante
A primeira versão não finge que sabe preços reais. Ela só mostra dados reais quando uma fonte de busca externa estiver configurada. Para comparar preços, ainda precisamos criar uma camada de extração/normalização que reconheça produto, versão, condição, preço e frete antes de apresentar um veredito.
CLICK AI busca automática - teste
