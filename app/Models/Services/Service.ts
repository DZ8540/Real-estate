import Label from './Label'
import User from '../Users/User'
import ServicesType from './ServicesType'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { ExperienceTypes } from 'Contracts/enums'
import { BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Service extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'experienceType', 'description',
    'isBanned', 'userId', 'servicesTypeId',
    'createdAt', 'updatedAt',
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public experienceType: number

  @column()
  public description: string

  @column()
  public isBanned: boolean

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'servicesType_id' })
  public servicesTypeId: ServicesType['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get experienceTypeForUser(): string {
    switch (this.experienceType) {
      case ExperienceTypes.BEFORE_ONE_YEAR:
        return 'До 1 года'
      case ExperienceTypes.BEFORE_THREE_YEAR:
        return 'До 3 лет'
      case ExperienceTypes.BEFORE_SIX_YEAR:
        return 'До 6 лет'
      case ExperienceTypes.BEFORE_TEN_YEAR:
        return 'До 10 лет'
      default:
        return ''
    }
  }

  @computed()
  public get isBannedForUser(): string {
    return this.isBanned ? 'Да' : 'Нет'
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => ServicesType)
  public servicesType: BelongsTo<typeof ServicesType>

  @manyToMany(() => Label, {
    pivotTable: 'labels_services',
  })
  public labels: ManyToMany<typeof Label>
}
