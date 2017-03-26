const request = require('supertest-test2doc')(require('supertest'))
const app = require('../../index')
const doc = require('./_doc').group('问题').basePath('/problems')

const ProblemModel = require('../../models/problem')

let problem

describe('Route: Problem', function () {
  before(async function () {
    [problem] = await ProblemModel[Symbol.for('create')]({
      userId: USER.id
    })
  })

  after(async function () {
    await problem.destroy()
  })

  doc.action('获取一道问题').is(doc => {
    it('获取一道问题', async function () {
      const res = await request(app).with(doc)
        .get(`/api/v1/problems/${problem.id}`)
        .expect(200)
      res.body.data.id.should.equal(problem.id)
    })
  })

  doc.action('获取全部问题').is(doc => {
    it('获取全部问题', async function () {
      const res = await request(app).with(doc)
        .get('/api/v1/problems')
        .query({
          limit: doc.val(1, '限制查询数量'),
          offset: doc.val(0, '查询偏移'),
          sortby: doc.val('id', '排序依据, 默认为 id, 可选 submitCount, passCount, percent'),
          order: doc.val('desc', '排序顺序, 默认为 desc, 可选 asc')
        })
        .expect(200)
      res.body.data.should.be.an.instanceOf(Array)
      res.body.data[0].should.have.properties('title')
    })
  })
})
