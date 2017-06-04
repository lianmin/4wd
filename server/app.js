const Koa = require('koa')
const logger = require('koa-logger')
const route = require('koa-route')
const xtpl = require('koa-xtpl')
const serve = require('koa-static2');
const path = require('path')
const chalk = require('chalk')

const app = new Koa();

app.use(logger())
app.use(serve('static', path.resolve(__dirname, '../dist/')))

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(chalk.gray(`${ctx.method} ${ctx.url} - ${ms}ms`));
});

let server = require('http').createServer(app.callback());
let io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(chalk.yellow('socket.io connected'))

  socket.on('ready', () => {
    console.log(chalk.yellow('socket.io ready'))
  })

  socket.on('engine', (status) => {
    console.log(chalk.yellow(`car engine: ${status}!`))
  })

  socket.on('command', (direction) => {
    console.log(chalk.yellow('command', direction))
  })
});

server.listen(8080, () => {
  console.log(chalk.yellow('server start at: 8080'))
});
