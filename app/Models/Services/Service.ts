import Label from './Label'
import User from '../Users/User'
import ServicesType from './ServicesType'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { EXPERIENCE_TYPES } from 'Config/services'
import {
  BaseModel, BelongsTo, belongsTo,
  column, computed, ManyToMany,
  manyToMany
} from '@ioc:Adonis/Lucid/Orm'

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

  @column({ serializeAs: null })
  public isBanned: boolean

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'servicesType_id' })
  public servicesTypeId: ServicesType['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @computed()
  public get experienceTypeForUser(): typeof EXPERIENCE_TYPES[number] {
    return EXPERIENCE_TYPES[this.experienceType]
  }

  @computed({ serializeAs: null })
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
