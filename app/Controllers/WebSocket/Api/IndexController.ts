import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from 'App/Services/Users/UserService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'

export default class IndexController {
  public static async connect(userId: User['id']): Promise<boolean> {
    try {
      await UserService.getById(userId)

      return true
    } catch (err: Error | any) {
      Logger.error(ResponseMessages.SOCKET_USER_ID_UNDEFINED)
      return false
    }
  }
}
