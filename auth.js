const jsonwebtoken = require('jsonwebtoken')
const KEY = 'jF3v6^Uw2y2ea&G%'
const jwt = require('koa-jwt')({ secret: KEY })

const errorHandler = (ctx, next) => {
    return next().catch(err => {
        if (err.status == 401) {
            ctx.status = 401
            ctx.body = {
                error: 'not authorized'
            }
        } else throw err
    })
}

const generate = (payload) => jsonwebtoken.sign(payload || {}, KEY)

module.exports = {
    jwt: () => jwt,
    errorHandler: () => errorHandler,
    generate
}