import ServicesType from './ServicesType'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class ServicesTypesSubService extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'name', 'servicesTypeId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column({ columnName: 'servicesType_id' })
  public servicesTypeId: ServicesType['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ServicesType)
  public type: BelongsTo<typeof ServicesType>

  @beforeSave()
  public static async setNameToLowerCase(item: ServicesTypesSubService) {
    item.name = item.name.toLowerCase()
  }
}
