const Koa = require('koa')
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const ObjectID = require('mongodb').ObjectID

const auth = require('./auth')

const app = new Koa()
const router = new Router()
const securedRouter = new Router()

require('./db')(app)

app
  .use(BodyParser())

router.get('/', async (ctx) => {
  ctx.body = { 
    message: 'Hello World!'
  }
})

router.post('/auth', async (ctx) => {
  ctx.body = {
    token: auth.generate()
  }
})

securedRouter
  .use(auth.errorHandler())
  .use(auth.jwt())

securedRouter.get('/events', async (ctx) => {
  ctx.body = await ctx.app.events.find().toArray()
})

securedRouter.get('/events/:id', async (ctx) => {
  ctx.body = await ctx.app.events.findOne(
    { _id: ObjectID(ctx.params.id) }
  )
})

securedRouter.put('/events/:id', async(ctx) => {
  ctx.body = await ctx.app.events.updateOne(
    { _id: ObjectID(ctx.params.id) },
    ctx.request.body
  )
})

securedRouter.delete('/events/:id', async(ctx) => {
  ctx.body = await ctx.app.events.deleteOne(
    { _id: ObjectID(ctx.params.id) }
  )
})

securedRouter.post('/events', async (ctx) => {
  ctx.body = await ctx.app.events.insert(ctx.request.body)
})

app
  .use(router.routes())
  .use(router.allowedMethods())
app
  .use(securedRouter.routes())
  .use(securedRouter.allowedMethods())

app.listen(3000) 