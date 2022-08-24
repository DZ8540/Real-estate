import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import Service from 'App/Models/Services/Service'
import Conversation from 'App/Models/Chat/Conversation'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import { DateTime } from 'luxon'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, JSONPaginate, ServiceConfig } from 'Contracts/services'
import { ConversationGetPayload, ConversationGetWithoutTopicPayload } from 'Contracts/conversation'

type GetConfig = ServiceConfig<Conversation> & {
  currentUser?: User['id'] | null, // For load new messages
}

export default class ConversationService {
  public static async paginate(userId: User['id'], config: ApiValidator['schema']['props']): Promise<JSONPaginate> {
    try {
      const conversations: JSONPaginate = (await Conversation
        .query()
        .withScopes((scopes) => scopes.getUserConversations(userId))
        .withScopes((scopes) => scopes.countNewMessagesForCurrentUser(userId))
        .get(config))
        .toJSON()

      conversations.data = await Promise.all(conversations.data.map(async (item: Conversation) => item.getForUser(userId)))

      return conversations
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(conversationId: Conversation['id'], { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
    let item: Conversation | null

    try {
      let query = Conversation.query()

      if (trx)
        query = query.useTransaction(trx)

      if (currentUser)
        query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

      item = await query
        .withScopes((scopes) => scopes.getById(conversationId))
        .first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }

  public static async getWithoutTopic(payload: ConversationGetWithoutTopicPayload, { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
    let item: Conversation | null

    try {
      let query = Conversation.query()

      if (trx)
        query = query.useTransaction(trx)

      if (currentUser)
        query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

      item = await query
        .withScopes((scopes) => scopes.getWithoutTopic(payload.fromId, payload.toId))
        .first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }

  public static async getWithRealEstateTopic(realEstateId: RealEstate['id'], payload: ConversationGetWithoutTopicPayload, { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
    let item: Conversation | null

    try {
      let query = Conversation.query()

      if (trx)
        query = query.useTransaction(trx)

      if (currentUser)
        query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

      item = await query
        .withScopes((scopes) => scopes.getWithRealEstateTopic(payload.fromId, payload.toId, realEstateId))
        .first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }

  public static async getWithServiceTopic(serviceId: Service['id'], payload: ConversationGetWithoutTopicPayload, { trx, currentUser }: GetConfig = {}): Promise<Conversation> {
    let item: Conversation | null

    try {
      let query = Conversation.query()

      if (trx)
        query = query.useTransaction(trx)

      if (currentUser)
        query = query.withScopes((scopes) => scopes.countNewMessagesForCurrentUser(currentUser))

      item = await query
        .withScopes((scopes) => scopes.getWithServiceTopic(payload.fromId, payload.toId, serviceId))
        .first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }

  public static async getConversationsWithNewMessages(userId: User['id']): Promise<number> {
    try {
      const result: { total: number }[] = await Conversation
        .query()
        .withScopes((scopes) => scopes.getUserConversations(userId))
        .whereHas('messages', (query) => {
          query
            .withScopes((scopes) => scopes.getNew())
            .withScopes((scopes) => scopes.notCurrentUser(userId))
        })
        .pojo<{ total: number }>()
        .count('*', 'total')

      return result[0].total
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: ConversationGetPayload, { trx }: ServiceConfig<Conversation> = {}): Promise<Conversation> {
    let conversationId: Conversation['id']

    try {
      const checkAlreadyExistsConversation: Conversation = await this.getWithoutTopic(payload)

      if (checkAlreadyExistsConversation)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error
    } catch (err: Error | any) {
      throw err
    }

    try {
      conversationId = (await Conversation.create(payload)).id
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      return await this.get(conversationId, { trx })
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async updateWhenMessageCreatedOrDeleted(conversation: Conversation, config?: ServiceConfig<Conversation>): Promise<void>
  public static async updateWhenMessageCreatedOrDeleted(conversationId: Conversation['id'], config?: ServiceConfig<Conversation>): Promise<void>
  public static async updateWhenMessageCreatedOrDeleted(conversationIdOrItem: Conversation | Conversation['id'], { trx }: ServiceConfig<Conversation> = {}): Promise<void> {
    if (typeof conversationIdOrItem !== 'object') {
      try {
        conversationIdOrItem = await this.get(conversationIdOrItem, { trx })
      } catch (err: Error | any) {
        throw err
      }
    }

    try {
      const timestamp: DateTime = DateTime.now()

      await conversationIdOrItem.merge({ updatedAt: timestamp }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
