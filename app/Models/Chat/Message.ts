import User from '../Users/User'
import Conversation from './Conversation'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, BelongsTo, belongsTo, column, ModelQueryBuilderContract, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Message extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'text', 'isViewed',
    'conversationId', 'userId', 'createdAt',
    'updatedAt', 'fromDeletedAt', 'toDeletedAt',
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public isViewed: boolean

  @column({ columnName: 'conversation_id' })
  public conversationId: Conversation['id']

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public fromDeletedAt?: DateTime

  @column.dateTime()
  public toDeletedAt?: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static getNew = scope((query) => {
    query.where('isViewed', false)
  })

  public static notCurrentUser = scope((query, userId: User['id']) => {
    query.whereNot('user_id', userId)
  })

  @beforeFind()
  @beforeFetch()
  public static preloadAndAggregateModels(query: ModelQueryBuilderContract<typeof Message>) {
    query.preload('user')
  }
}
