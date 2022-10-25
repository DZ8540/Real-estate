import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import Message from 'App/Models/Chat/Message'
import Database from '@ioc:Adonis/Lucid/Database'
import Conversation from 'App/Models/Chat/Conversation'
import ConversationService from './ConversationService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import MessageWithoutTopicValidator from 'App/Validators/Api/Message/MessageWithoutTopicValidator'
import MessageWithServiceTopicValidator from 'App/Validators/Api/Message/MessageWithServiceTopicValidator'
import MessageWithRealEstateTopicValidator from 'App/Validators/Api/Message/MessageWithRealEstateTopicValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ConversationGetPayload } from 'Contracts/conversation'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { MessageCreateWithoutTopicPayload, ReturnMessageCreatePayload } from 'Contracts/message'

export default class MessageService {
  public static async paginate(conversationId: Conversation['id'], config: ApiValidator['schema']['props']): Promise<ModelPaginatorContract<Message>> {
    let conversation: Conversation

    try {
      conversation = await ConversationService.get(conversationId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      return await conversation
        .related('messages')
        .query()
        .get(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(userId: User['id'], payload: MessageWithoutTopicValidator['schema']['props']): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.get(payload.conversationId, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      const message: Message = await Message.create({
        userId,
        text: payload.text,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async createWithoutTopic({ text }: MessageWithoutTopicValidator['schema']['props'], payload: MessageCreateWithoutTopicPayload): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation | null = null
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.getWithoutTopic(payload, { trx })
    } catch (err: Error | any) {}

    if (!conversation) {
      try {
        conversation = await ConversationService.create(payload, { trx })
      } catch (err: Error | any) {
        await trx.rollback()

        throw err
      }
    }

    try {
      conversation = await ConversationService.get(conversation.id, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      const message: Message = await Message.create({
        text,
        userId: payload.fromId,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async createWithRealEstateTopic(payload: MessageWithRealEstateTopicValidator['schema']['props'], createPayload: MessageCreateWithoutTopicPayload): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation | null = null
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.getWithRealEstateTopic(payload.realEstateId, createPayload, { trx })
    } catch (err: Error | any) {}

    if (!conversation) {
      try {
        const createConversationPayload: ConversationGetPayload = {
          ...createPayload,
          realEstateId: payload.realEstateId,
        }

        conversation = await ConversationService.create(createConversationPayload, { trx })
      } catch (err: Error | any) {
        await trx.rollback()

        throw err
      }
    }

    try {
      conversation = await ConversationService.get(conversation.id, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      const message: Message = await Message.create({
        text: payload.text,
        userId: createPayload.fromId,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async createWithServiceTopic(payload: MessageWithServiceTopicValidator['schema']['props'], createPayload: MessageCreateWithoutTopicPayload): Promise<ReturnMessageCreatePayload> {
    let conversation: Conversation | null = null
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.getWithServiceTopic(payload.serviceId, createPayload, { trx })
    } catch (err: Error | any) {}

    if (!conversation) {
      try {
        const createConversationPayload: ConversationGetPayload = {
          ...createPayload,
          serviceId: payload.serviceId,
        }

        conversation = await ConversationService.create(createConversationPayload, { trx })
      } catch (err: Error | any) {
        await trx.rollback()

        throw err
      }
    }

    try {
      conversation = await ConversationService.get(conversation.id, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      const message: Message = await Message.create({
        text: payload.text,
        userId: createPayload.fromId,
        conversationId: conversation.id,
      }, { client: trx })

      await trx.commit()
      return { message, conversation }
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async update(messageId, payload: MessageWithoutTopicValidator['schema']['props']): Promise<Message> {
    let item: Message

    try {
      item = await this.get(messageId)
    } catch (err: Error | any) {
      throw err
    }

    try {
      item = await item.merge(payload).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      return await this.get(item.id)
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async viewed(conversation: Conversation, userId: User['id']): Promise<void>
  public static async viewed(conversationId: Conversation['id'], userId: User['id']): Promise<void>
  public static async viewed(conversationOrConversationId: Conversation | Conversation['id'], userId: User['id']): Promise<void> {
    if (typeof conversationOrConversationId !== 'object') {
      try {
        conversationOrConversationId = await ConversationService.get(conversationOrConversationId)
      } catch (err: Error | any) {
        throw err
      }
    }

    try {
      await conversationOrConversationId
        .related('messages')
        .query()
        .withScopes((scopes) => scopes.getNew())
        .withScopes((scopes) => scopes.notCurrentUser(userId))
        .update({ isViewed: true })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(messagesIds: Message['id'][], conversationId: Conversation['id']): Promise<void> {
    let conversation: Conversation
    const trx = await Database.transaction()

    try {
      conversation = await ConversationService.get(conversationId, { trx })
      await ConversationService.updateWhenMessageCreatedOrDeleted(conversation, { trx })
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      await conversation
        .related('messages')
        .query()
        .whereIn('id', messagesIds)
        .delete()

      await trx.commit()
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  private static async get(id: Message['id']): Promise<Message> {
    let item: Message | null

    try {
      item = await Message.find(id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    return item
  }
}
