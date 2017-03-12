const { Random } = require('mockjs')

const MODELNAME = 'User'

module.exports = Object.assign(DATABASE[MODELNAME], {
})

module.exports[Symbol.for('mock')] = () => {
  return {
    name: Random.name(),
    email: Random.email(),
    password: Random.word(10),
    school: Random.word(),
    gender: Random.integer(0, 1),
    avatar: Random.image('100x100'),
    remark: Random.sentence()
  }
}

module.exports[Symbol.for('create')] = async function (obj) {
  const ret = []
  for (const obj of Array.from(arguments)) {
    const defaultData = await this[Symbol.for('mock')]()
    const model = await this.create(Object.assign(defaultData, obj))
    ret.push(model)
  }
  return ret
}
