const Service = require('../../extend/service')
const ProblemService = new (require('../../service/problems')(Service))()

describe('service/problems', () => {
  it('show', async () => {
    await assert.isRejected(ProblemService.show('123123'), Error)
  })
})