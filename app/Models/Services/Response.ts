import User from '../Users/User'
import Service from '../Services/Service'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import {
  BaseModel, beforeFetch, beforeFind, BelongsTo,
  belongsTo, column, ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'

export default class Response extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'status', 'userId', 'serviceId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public status: number

  @column()
  public description?: string

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'service_id' })
  public serviceId: Service['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Response>) {
    query
      .preload('user')
      .preload('service')
  }
}
