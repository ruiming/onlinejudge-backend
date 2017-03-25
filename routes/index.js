const Router = require('koa-router')

const Problem = require('./problem')
const Submission = require('./submission')
const User = require('./user')
const Managerment = require('./managerment')
const Authentication = require('../middlewares/authentication')

const api = new Router({
  prefix: '/api'
})

api.use('/v1/problems', Problem.middleware())
api.use('/v1/submissions', Submission.middleware())
api.use('/v1/users', User.middleware())

api.use('/v6', Authentication(), Managerment.middleware())

module.exports = api
