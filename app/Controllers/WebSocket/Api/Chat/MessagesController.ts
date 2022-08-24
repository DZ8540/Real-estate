import User from 'App/Models/Users/User'
import Message from 'App/Models/Chat/Message'
import Conversation from 'App/Models/Chat/Conversation'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import MessageService from 'App/Services/Chat/MessageService'
import MessageWithoutTopicValidator from 'App/Validators/Api/Message/MessageWithoutTopicValidator'
import MessageWithServiceTopicValidator from 'App/Validators/Api/Message/MessageWithServiceTopicValidator'
import MessageWithRealEstateTopicValidator from 'App/Validators/Api/Message/MessageWithRealEstateTopicValidator'
import { Error } from 'Contracts/services'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { MessageCreateWithoutTopicPayload, ReturnMessageCreatePayload } from 'Contracts/message'

const apiValidator: ApiValidator = new ApiValidator()
const messageWithoutTopicValidator: MessageWithoutTopicValidator = new MessageWithoutTopicValidator()
const messageWithRealEstateTopicValidator: MessageWithRealEstateTopicValidator = new MessageWithRealEstateTopicValidator()
const messageWithServiceTopicValidator: MessageWithServiceTopicValidator = new MessageWithServiceTopicValidator()

export default class MessagesController {
  public static async paginate(conversationId: Conversation['id'], apiPayload: any, cb: (response: Error | ResponseService) => void): Promise<void> {
    let validatedApiPayload: ApiValidator['schema']['props']

    try {
      validatedApiPayload = await validator.validate({
        data: apiPayload,
        schema: apiValidator.schema,
        messages: apiValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const messages: ModelPaginatorContract<Message> = await MessageService.paginate(conversationId, validatedApiPayload)

      return cb(ResponseService.success(ResponseMessages.SUCCESS, messages))
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async create(userId: User['id'], payload: any, cb: (response: Error | ResponseService) => void): Promise<ReturnMessageCreatePayload | void> {
    let validatedPayload: MessageWithoutTopicValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
        schema: messageWithoutTopicValidator.schema,
        messages: messageWithoutTopicValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const data: ReturnMessageCreatePayload = await MessageService.create(userId, validatedPayload)

      cb(ResponseService.success(ResponseMessages.SUCCESS, data.message))
      return data
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async createWithoutTopic(payload: any, createPayload: MessageCreateWithoutTopicPayload, cb: (response: Error | ResponseService) => void): Promise<ReturnMessageCreatePayload | void> {
    let validatedPayload: MessageWithoutTopicValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
        schema: messageWithoutTopicValidator.schema,
        messages: messageWithoutTopicValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const data: ReturnMessageCreatePayload = await MessageService.createWithoutTopic(validatedPayload, createPayload)

      cb(ResponseService.success(ResponseMessages.SUCCESS, data.message))
      return data
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async createWithRealEstateTopic(payload: any, createPayload: MessageCreateWithoutTopicPayload, cb: (response: Error | ResponseService) => void): Promise<ReturnMessageCreatePayload | void> {
    let validatedPayload: MessageWithRealEstateTopicValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
        schema: messageWithRealEstateTopicValidator.schema,
        messages: messageWithRealEstateTopicValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const data: ReturnMessageCreatePayload = await MessageService.createWithRealEstateTopic(validatedPayload, createPayload)

      cb(ResponseService.success(ResponseMessages.SUCCESS, data.message))
      return data
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async createWithServiceTopic(payload: any, createPayload: MessageCreateWithoutTopicPayload, cb: (response: Error | ResponseService) => void): Promise<ReturnMessageCreatePayload | void> {
    let validatedPayload: MessageWithServiceTopicValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
        schema: messageWithServiceTopicValidator.schema,
        messages: messageWithServiceTopicValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const data: ReturnMessageCreatePayload = await MessageService.createWithServiceTopic(validatedPayload, createPayload)

      cb(ResponseService.success(ResponseMessages.SUCCESS, data.message))
      return data
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async update(messageId: Message['id'], payload: any, cb: (response: Error | ResponseService) => void): Promise<Message | void> {
    let validatedPayload: MessageWithoutTopicValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
        schema: messageWithoutTopicValidator.schema,
        messages: messageWithoutTopicValidator.messages,
      })
    } catch (err: any) {
      return cb({
        code: ResponseCodes.CLIENT_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        errors: err.messages,
      })
    }

    try {
      const message: Message = await MessageService.update(messageId, validatedPayload)

      cb(ResponseService.success(ResponseMessages.SUCCESS, message))
      return message
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async delete(messagesIds: Message['id'][], conversationId: Conversation['id'], cb: (response: Error | ResponseService) => void): Promise<boolean> {
    try {
      await MessageService.delete(messagesIds, conversationId)

      cb(ResponseService.success(ResponseMessages.SUCCESS))
      return true
    } catch (err: Error | any) {
      cb(err)
      return false
    }
  }
}
