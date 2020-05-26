const Koa = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');

const app = new Koa();
const router = new Router();

app.use(cors());

app
  .use(router.routes())
  .use(router.allowedMethods());

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async (ctx, next) => {
  console.log(ctx.request)

  const {request: {header: {origin}}} = ctx;
 
  if (origin === 'http://localhost:3001') {
    await next();
  } else {
    ctx.throw(401);
  }
});

app.use(async (ctx) => {
  console.log(ctx.request)
  ctx.body = {
    id: '571089fa-7d2b-4660-9740-4edcbf4dcdbb',
    name: 'economic.html',
    author: 'Dummy Man',
  };
});

app.listen(4000);
