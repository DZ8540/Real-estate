import User from 'App/Models/Users/User'
import Conversation from 'App/Models/Chat/Conversation'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ConversationService from 'App/Services/Chat/ConversationService'
import ConversationMessageService from 'App/Services/Chat/MessageService'
import { SocketData } from 'Contracts/webSocket'
import { JSONPaginate } from 'Contracts/services'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { validator } from '@ioc:Adonis/Core/Validator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

const apiValidator: ApiValidator = new ApiValidator()

export default class ConversationsController {
  public static async paginate(userId: SocketData['userId'], payload: any, cb: (response: Error | ResponseService) => void): Promise<void> {
    let validatedPayload: ApiValidator['schema']['props']

    try {
      validatedPayload = await validator.validate({
        data: payload,
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
      const conversations: JSONPaginate = await ConversationService.paginate(userId, validatedPayload)

      return cb(ResponseService.success(ResponseMessages.SUCCESS, conversations))
    } catch (err: Error | any) {
      return cb(err)
    }
  }

  public static async get(conversationId: Conversation['id'], currentUserId: User['id'], cb: (response: Error | ResponseService) => void): Promise<Conversation | void> {
    try {
      const item: Conversation = await ConversationService.get(conversationId)
      const itemForUser: ModelObject = await item.getForUser(currentUserId)

      await ConversationMessageService.viewed(item.id, currentUserId)

      cb(ResponseService.success(ResponseMessages.SUCCESS, itemForUser))
      return itemForUser as Conversation
    } catch (err: Error | any) {
      return cb(err)
    }
  }
}
