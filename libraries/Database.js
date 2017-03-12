const Sequelize = require('sequelize')
const humps = require('humps')
const databaseConfig = require('config').get('Database')

// 定义 Schema
const DatabaseSchema = {
  User: {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    school: {
      type: Sequelize.STRING
    },
    gender: {
      type: Sequelize.INTEGER
    },
    avatar: {
      type: Sequelize.STRING
    },
    remark: {
      type: Sequelize.STRING
    }
  },
  Problem: {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.STRING
    },
    input: {
      type: Sequelize.TEXT
    },
    output: {
      type: Sequelize.TEXT
    },
    sampleInput: {
      type: Sequelize.STRING
    },
    sampleOutput: {
      type: Sequelize.STRING
    },
    inputData: {
      type: Sequelize.TEXT
    },
    outputData: {
      type: Sequelize.TEXT
    },
    submitCount: {
      type: Sequelize.INTEGER
    },
    passCount: {
      type: Sequelize.INTEGER
    },
    maxCpuTime: {
      type: Sequelize.INTEGER,
      defaultValue: 1000
    },
    max_real_time: {
      type: Sequelize.INTEGER,
      defaultValue: 2000
    },
    maxMemory: {
      type: Sequelize.INTEGER,
      defaultValue: 1000000000
    },
    maxProcessNumber: {
      type: Sequelize.INTEGER,
      defaultValue: 200
    },
    maxOutputSize: {
      type: Sequelize.INTEGER,
      defaultValue: 10000
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    }
  },
  Submission: {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true
    },
    problemId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false
    },
    code: {
      type: Sequelize.TEXT
    },
    type: {
      type: Sequelize.STRING
    },
    cpuTime: {
      type: Sequelize.INTEGER
    },
    realTime: {
      type: Sequelize.INTEGER
    },
    signal: {
      type: Sequelize.INTEGER
    },
    memory: {
      type: Sequelize.INTEGER
    },
    exitCode: {
      type: Sequelize.INTEGER
    },
    result: {
      type: Sequelize.INTEGER
    },
    error: {
      type: Sequelize.INTEGER
    }
  }
}

// camelCaseToUnderscored
for (let schema of Object.values(DatabaseSchema)) {
  for (let key in schema) {
    let camel = humps.decamelize(key)
    if (camel !== key) schema[key]['field'] = camel
  }
}

// 建立数据库连接
const sequelize = new Sequelize(databaseConfig.name, databaseConfig.username, databaseConfig.password, {
  host: databaseConfig.host,
  port: databaseConfig.port,
  dialect: databaseConfig.dialect,
  dialectOptions: {
    charset: 'utf8',
    collate: 'utf8_general_ci'
  },
  define: {
    underscored: true,
    underscoredAll: true
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: false,
  benchmark: false
})

// 连接信息
sequelize.authenticate().then(() => {
  console.log('数据库连接成功')
}).catch(e => {
  console.error('数据库连接失败')
  console.log(e)
})

// 全局变量
const Database = global.DATABASE = {
  sequelize: sequelize,

  Problem: sequelize.define('Problem', DatabaseSchema.Problem),
  Submission: sequelize.define('Submission', DatabaseSchema.Submission),
  User: sequelize.define('User', DatabaseSchema.User)
}

// 建立表之间的关联
Database.Submission.belongsTo(Database.Problem, {
  as: 'problem',
  foreignKey: 'problemId'
})
Database.Submission.belongsTo(Database.User, {
  as: 'user',
  foreignKey: 'userId'
})
Database.Problem.belongsTo(Database.User, {
  as: 'user',
  foreignKey: 'userId'
})

module.exports = {
  DatabaseSchema: DatabaseSchema,
  Database: Database
}
