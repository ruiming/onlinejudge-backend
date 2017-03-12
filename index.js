global.Promise = require('bluebird')

require('./libraries/Database')
require('./libraries/Queue')
require('./libraries/Cache')

const Koa = require('koa')
const jwt = require('koa-jwt')
const middlerwares = require('./middlewares')
const router = require('./routes/index')

const Port = require('config').get('Port')
const Env = require('config').get('Env')
const Jwt = require('config').get('Jwt')

const app = new Koa()

app.use(middlerwares)

app.use(jwt({
  secret: Jwt.secret,
  algorithm: Jwt.algorithm,
  passthrough: true
}))

app.use(router.routes())
   .use(router.allowedMethods())

module.exports = app.listen(Port, () => console.log(`运行端口: ${Port}\n运行环境: ${Env}`))
