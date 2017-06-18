import { database } from 'app/library/database'
import { Submission } from 'app/model/Submission'
import { User } from 'app/model/User'
import { Random } from 'mockjs'
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript'

@Table
export class Problem extends Model<Problem> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number

  @Column
  public title: string

  @Column(DataType.TEXT)
  public description: string

  @Column
  public lang: string

  @Column(DataType.TEXT)
  public input: string

  @Column(DataType.TEXT)
  public output: string

  @Column(DataType.FLOAT)
  get percent (): string {
    return (this.getDataValue('passCount') / this.getDataValue('submitCount')).toFixed(2)
  }

  set percent (val: string) {
    this.setDataValue('percent', val)
  }

  @Column
  public sampleInput: string

  @Column
  public sampleOutput: string

  @Column(DataType.TEXT)
  public inputData: string

  @Column(DataType.TEXT)
  public outputData: string

  @Column
  public submitCount: number

  @Column
  public passCount: number

  @Column
  public maxCpuTime: number

  @Column
  public maxRealTime: number

  @Column
  public maxMemory: number

  @Column
  public maxProcessNumber: number

  @Column
  public maxOutputSize: number

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  public userId: string

  @BelongsTo(() => User)
  public user: User

  public static MOCK_DATA (item?: {}): {} {
    return {
      description: Random.paragraph(),
      title: Random.string(),
      lang: Random.string(),
      input: Random.string(),
      output: Random.string(),
      percent: Random.float(),
      sampleInput: Random.string(),
      sampleOutput: Random.string(),
      submitCount: Random.integer(100, 200),
      passCount: Random.integer(10, 20),
      maxCpuTime: Random.integer(1000, 2000),
      maxRealTime: Random.integer(1000, 2000),
      maxMemory: Random.integer(1000, 2000),
      maxProcessNumber: Random.integer(1000, 2000),
      maxOutputSize: Random.integer(1000, 2000),
      inputData: Random.string(),
      outputData: Random.string(),
      ...item
    }
  }
}