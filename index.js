const Koa = require('koa')
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const ObjectID = require('mongodb').ObjectID
const Passport = require('koa-passport')
const GoogleTokenStrategy = require('passport-google-token').Strategy;


const auth = require('./auth')

const app = new Koa()
const router = new Router()
const securedRouter = new Router()

require('./db')(app)

Passport.serializeUser((user, done) => done(null, user))
Passport.deserializeUser((user, done) => done(null, user))

Passport.use(new GoogleTokenStrategy({
  clientID: '516748484660-ui29nceef6h3c6pkjh536pa43iabiqqr.apps.googleusercontent.com',
  clientSecret: 'ITfJoair0g5UXcquMBJElx-W'
}, (accessToken, refreshToken, profile, done) => {
  // const user = await app.users.findOrCreate({ googleId: profile.id })
  // console.log(user)
  // return done(null, user)
  if (profile) {
    done(null, {token: auth.generate() })
  }
}))


app
  .use(BodyParser())
  .use(Passport.initialize())

router.get('/', async (ctx) => {
  ctx.body = { 
    message: 'Hello World!'
  }
})

router.post('/auth', Passport.authenticate('google-token'), async (ctx) => {
  ctx.body = {
    status: 'got im',
    token: ctx.state.user.token
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