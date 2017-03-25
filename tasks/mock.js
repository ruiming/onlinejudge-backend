const { SHA256 } = require('crypto-js')
const Queue = require('../libraries/Queue')
const { Database } = require('../libraries/Database')

const models = ['User', 'Problem', 'Submission']
const inputData = '1 2'
const outputData = '3'
const code = `
#include<iostream>
using namespace std;
int main() {
  int a, b
  cin >> a >> b
  return a+b
}`
let ProblemModel, SubmissionModel, UserModel

describe('Mock 数据', function () {
  before(async function () {
    await Database.sequelize.authenticate()
    ProblemModel = require('../models/problem')
    SubmissionModel = require('../models/submission')
    UserModel = require('../models/user')
  })
  it('Destroy Database', async function () {
    for (const model of [...models].reverse()) {
      await Database[model].drop({
        force: true
      })
    }
  })
  it('Initialize Database', async function () {
    for (const model of models) {
      await Database[model].sync({
        force: true
      })
    }
  })
  it('Mock Data', async function () {
    // 创建两个用户
    const users = await UserModel[Symbol.for('create')]({
      name: 'test',
      password: SHA256('testtest').toString()
    }, {})
    let problems = []
    // 每个用户创建 6 条 Problem 表的 Mock 数据
    for (let i = 0; i < 10; i++) {
      problems = await Promise.all(users.map(user => ProblemModel[Symbol.for('create')](
        { userId: user.id, inputData, outputData }, { userId: user.id, inputData, outputData },
        { userId: user.id, inputData, outputData }, { userId: user.id, inputData, outputData },
        { userId: user.id, inputData, outputData }, { userId: user.id, inputData, outputData }
      )))
    }
    // 创建一个正确的 submission
    const [submission] = await SubmissionModel[Symbol.for('create')]({
      problemId: problems[0][0].id,
      userId: users[0].id,
      code
    })
    // 同时往消息队列插入该 submission
    await Queue.submitCheckCodeTask(submission.id)
  })
})