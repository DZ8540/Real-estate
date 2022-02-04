import User from 'App/Models/User'
import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class UserService extends BaseService {
  public static async getAll({ page, limit, columns, baseURL, orderBy, orderByColumn }: GetAllConfig<typeof User['columns'][number]>): Promise<User[]> {
    if (!columns)
      columns = ['id', 'firstName', 'lastName', 'email', 'isBanned']

    try {
      return await User.query().select(columns).get({ page, limit, baseURL, orderBy, orderByColumn })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(config: GetConfig<User>): Promise<User> {
    let item: User | null

    try {
      item = await User.findBy(config.column, config.val, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error
    }
  }

  public static async create(payload: RegisterValidator['schema']['props'], trx?: TransactionClientContract): Promise<User> {
    try {
      return await User.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async activate(uuid: User['uuid']): Promise<void> {
    let item: User

    try {
      item = (await this.get({ column: 'uuid', val: uuid }))!
    } catch (err: Error | any) {
      Logger.error(err)
      throw err
    }

    try {
      if (item.isActivated)
        throw new Error()
    } catch (err: Error | any) {
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ALREADY_ACTIVATED } as Error
    }

    try {
      item.isActivated = true
      item.save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async block(config: GetConfig<User>): Promise<void> {
    try {
      (await this.get(config))!.merge({ isBanned: true }).save()
    } catch (err: Error | any) {
      Logger.error(err)
      throw err
    }
  }

  public static async unblock(config: GetConfig<User>): Promise<void> {
    try {
      (await this.get(config))!.merge({ isBanned: false }).save()
    } catch (err: Error | any) {
      Logger.error(err)
      throw err
    }
  }
}
