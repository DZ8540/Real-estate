import BaseService from './BaseService'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Logger from '@ioc:Adonis/Core/Logger'
import UserService from './Users/UserService'
import Database from '@ioc:Adonis/Lucid/Database'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import { Roles } from 'Contracts/enums'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class AuthService extends BaseService {
  public static async register(payload: RegisterValidator['schema']['props']): Promise<void> {
    let user: User
    let trx = await Database.transaction()

    try {
      user = await UserService.create(payload, trx)
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    try {
      await AuthService.sendActivationMail(user)
    } catch (err: Error | any) {
      await trx.rollback()

      throw err
    }

    await trx.commit()
  }

  public static async login({ email, password }: LoginValidator['schema']['props']): Promise<User> {
    try {
      let candidate: User = (await User.findBy('email', email))!
      await candidate.load('realEstatesWishList')
      await candidate.load('realEstatesReports')

      if (!candidate.isActivated)
        throw new Error()

      if (await Hash.verify(candidate.password, password))
        return candidate
      else
        throw new Error()
    } catch (err: Error | any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error
    }
  }

  public static async checkAdmin(id: User['id']): Promise<void> {
    let accessRoles: Roles[] = [Roles.ADMIN, Roles.MANAGER]
    let currentUser: User

    try {
      currentUser = await UserService.get({ column: 'id', val: id, relations: ['role'] })
    } catch (err: Error | any) {
      throw err
    }

    try {
      if (!accessRoles.includes(currentUser.role.name as Roles))
        throw new Error()
    } catch (err: Error | any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NOT_ADMIN } as Error
    }
  }

  public static async sendActivationMail(user: User): Promise<void> {
    try {
      await Mail.send((message) => {
        message
          .from('d.z.mailer@inbox.ru')
          .to(user.email)
          .subject('Подтвердите свой аккаунт')
          .htmlView('emails/activation', { user })
      })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.MAILER_ERROR, message: ResponseMessages.EMAIL_NOT_FOUND } as Error
    }
  }
}
