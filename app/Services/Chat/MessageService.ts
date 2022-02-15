import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import Message from 'App/Models/Chat/Message'
import Database from '@ioc:Adonis/Lucid/Database'
import MessagesImage from 'App/Models/Chat/MessagesImage'
import MessageValidator from 'App/Validators/Chat/MessageValidator'
import MessageImageValidator from 'App/Validators/Chat/MessageImageValidator'
import { Error } from 'Contracts/services'
import { MESSAGES_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class MessageService {
  public static async create(payload: MessageValidator['schema']['props']): Promise<Message> {
    try {
      return (await Message.create(payload))!
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async addImages(payload: MessageImageValidator['schema']['props']): Promise<string[]> {
    let trx = await Database.transaction()
    let basePath: string = `${MESSAGES_PATH}/${payload.messageId}`
    let images: string[] = []

    try {
      for (let item of payload.images) {
        item.moveToDisk(basePath)
        images.push(`${basePath}/${item.fileName}`)
      }
    } catch (err: any) {
      for (let item of images) {
        await Drive.delete(item)
      }

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      for (let item of images) {
        await MessagesImage.create({ image: item, messageId: payload.messageId }, { client: trx })
      }

      await trx.commit()
      return images
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
