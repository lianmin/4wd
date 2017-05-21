const Koa = require('koa')
const logger = require('koa-logger')
const route = require('koa-route')
const json = require('koa-json')
const xtpl = require('koa-xtpl')
const path = require('path')
const koaStatic = require('koa-static')
const robotRoute = require('./routes/4wd')

const app = new Koa();

app.use(json())
app.use(logger())
app.use(xtpl({
  root: path.join(__dirname, './views'),
  extname: 'xtpl',
  commands: {}
}))
app.use(koaStatic(__dirname + '../dist'));
app.use(route.get('/test', robotRoute._4wd))

// logger
app.use(async(ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

async function all(ctx, next) {
  await ctx.render('index', {title: new Date()})
}


let server = require('http').createServer(app.callback());

let io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('connection open')

  socket.on('left', () => {
    console.log('left')
  })

  socket.on('right', (e) => {
    console.log('right')
  })

  socket.on('forward', (e) => {
    console.log('forward')
  })

  socket.on('backward', (e) => {
    console.log('backward')
  })

  socket.on('stop', (e) => {
    console.log('stop')
  })

  socket.on('orient', (e) => {
    console.log('orient', e)
  })
});


server.listen(3000);
