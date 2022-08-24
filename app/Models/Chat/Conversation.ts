import Message from './Message'
import User from '../Users/User'
import Service from '../Services/Service'
import RealEstate from '../RealEstates/RealEstate'
import UserService from 'App/Services/Users/UserService'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, beforeFetch, beforeFind, BelongsTo, belongsTo, column, HasMany, hasMany, hasOne, HasOne, ModelObject, ModelQueryBuilderContract, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Conversation extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'realEstateId', 'serviceId', 'fromId', 'toId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'realEstate_id' })
  public realEstateId: RealEstate['id']

  @column({ columnName: 'service_id' })
  public serviceId: Service['id']

  @column({ columnName: 'from_id' })
  public fromId: User['id']

  @column({ columnName: 'to_id' })
  public toId: User['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Message)
  public messages: HasMany<typeof Message>

  @hasOne(() => Message, {
    onQuery(query) {
      query.orderBy('id', 'desc')
    },
  })
  public lastMessage: HasOne<typeof Message>

  @belongsTo(() => User, { localKey: 'from_id' })
  public fromUser: BelongsTo<typeof User>

  @belongsTo(() => User, { localKey: 'to_id' })
  public toUser: BelongsTo<typeof User>

  public static getById = scope((query, id: Conversation['id']) => {
    query.where('id', id)
  })

  public static getWithoutTopic = scope((query, fromId: User['id'], toId: User['id']) => {
    query
      .whereNull('realEstate_id')
      .andWhereNull('service_id')
      .andWhereIn(['from_id', 'to_id'], [[ fromId, toId ]])
      .orWhereIn(['to_id', 'from_id'], [[ toId, fromId ]])
  })

  public static getWithRealEstateTopic = scope((query, fromId: User['id'], toId: User['id'], realEstateId: RealEstate['id']) => {
    query
      .whereNull('service_id')
      .andWhere('realEstate_id', realEstateId)
      .andWhereIn(['from_id', 'to_id'], [[ fromId, toId ]])
      .orWhereIn(['to_id', 'from_id'], [[ toId, fromId ]])
  })

  public static getWithServiceTopic = scope((query, fromId: User['id'], toId: User['id'], serviceId: Service['id']) => {
    query
      .whereNull('realEstate_id')
      .andWhere('service_id', serviceId)
      .andWhereIn(['from_id', 'to_id'], [[ fromId, toId ]])
      .orWhereIn(['to_id', 'from_id'], [[ toId, fromId ]])
  })

  public static getUserConversations = scope((query, userId: User['id']) => {
    query
      .where('from_id', userId)
      .orWhere('to_id', userId)
  })

  public static countNewMessagesForCurrentUser = scope((query: ModelQueryBuilderContract<typeof Conversation>, userId: User['id']) => {
    query.withCount('messages', (query) => {
      query
        .withScopes((scopes) => scopes.getNew())
        .withScopes((scopes) => scopes.notCurrentUser(userId))
        .as('newMessagesCount')
    })
  })

  @beforeFind()
  @beforeFetch()
  public static preloadAndAggregateModels(query: ModelQueryBuilderContract<typeof Conversation>) {
    query.preload('lastMessage')
  }

  public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
    const those: Conversation = this // For types
    const item: ModelObject = { ...those.toJSON() }
    const actualUserId: User['id'] = those.fromId == currentUserId ? those.toId : those.fromId

    item.user = await (await UserService.getById(actualUserId)).getForUser(currentUserId)

    return item
  }
}
