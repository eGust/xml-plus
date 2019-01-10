const { argv } = require('process');

const Koa = require('koa');
const serve = require('koa-static');
const logger = require('koa-logger');
const koaRouter = require('koa-router');

const fetch = require('node-fetch');
const qs = require('query-string');

const args = argv.slice(2);
const app = new Koa();

const isDebug = !!args.find(s => s.toLowerCase() === '--debug');
const port = isDebug ? 8000 : 80;
const cacheControl = isDebug ? 'max-age=-1' : 'max-age=3600';
const maxage = isDebug ? 0 : 3600000;

const router = koaRouter();
const fetchUrl = async (ctx) => {
  const { request } = ctx;
  const { url } = qs.parse(request.querystring);
  if (!url) {
    ctx.status = 500;
    ctx.body = 'unknown URL';
    return;
  }

  const res = await fetch(url);
  ctx.status = res.status;

  const { headers } = res;
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Cache-Control', cacheControl);
  Array.from(headers.keys()).forEach((key) => {
    if (key === 'content-type') {
      ctx.set('Content-Type', headers.get(key));
    }
  });
  ctx.body = res.body;
};

router.get('/fetch', fetchUrl);

if (isDebug) {
  app.use(logger());
}
app.use(serve('public', { maxage }));
app.use(router.routes());

app.listen(port);
console.log(`listening on port ${port}`);
