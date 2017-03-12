require('should')
require('../../libraries/Database')
require('../../libraries/Queue')
const { ParamsError } = require('../../libraries/Error')
const ProblemService = require('../../services/problem')
const ProblemModel = require('../../models/problem')
const UserModel = require('../../models/user')

let user
let problems = []

describe('Problem', function () {
  before(async function () {
    [user] = await UserModel[Symbol.for('create')]({})
    problems = await ProblemModel[Symbol.for('create')]({ userId: user.id }, { userId: user.id }, { userId: user.id }, { userId: user.id }, { userId: user.id })
  })

  after(async function () {
    await Promise.all(problems.map(problem => problem.destroy()))
    await user.destroy()
  })

  it('call getProblemById with an exist id should be ok', async () => {
    const problem = await ProblemService.getProblemById({ id: problems[0].id })
    problem.id.should.equal(problems[0].id)
  })

  it('call getProblemById with nothing should throw error', async () => {
    let error = await ProblemService.getProblemById({}).catch(e => e)
    error.should.be.an.instanceof(ParamsError)
  })

  it('call getProblemById with an unexisted id should throw error', async () => {
    let error = await ProblemService.getProblemById({id: 1251521525}).catch(e => e)
    error.should.be.an.instanceof(ParamsError)
  })

  it('call getProblemById with an error type of id should throw error', async () => {
    let error = await ProblemService.getProblemById({id: 'c314fag'}).catch(e => e)
    error.should.be.an.instanceof(ParamsError)
  })
})