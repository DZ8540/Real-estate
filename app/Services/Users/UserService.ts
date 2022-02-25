import User from 'App/Models/Users/User'
import BaseService from '../BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof User['columns'][number]

export default class UserService extends BaseService {
  public static async getAll(config: PaginateConfig<Columns>, columns: Columns[] = ['id', 'uuid', 'firstName', 'lastName', 'email', 'isBanned', 'createdAt']): Promise<User[]> {
    try {
      return await User.query().select(columns).get(config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async get(uuid: User['uuid'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.findBy('uuid', uuid, { client: config.trx })
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

  public static async getById(id: User['id'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.find(id, { client: config.trx })
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

  public static async create(payload: RegisterValidator['schema']['props'], { trx }: ServiceConfig<User> = {}): Promise<User> {
    try {
      return await User.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async activate(uuid: User['uuid'], config: ServiceConfig<User> = {}): Promise<void> {
    let item: User

    try {
      item = await this.get(uuid, config)
    } catch (err: Error | any) {
      Logger.error(err)
      throw err
    }

    if (item.isActivated)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ALREADY_ACTIVATED } as Error

    try {
      item.isActivated = true
      await item.save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async block(uuid: User['uuid'], config: ServiceConfig<User> = {}): Promise<User> {
    try {
      return (await this.get(uuid, config)).merge({ isBanned: true }).save()
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async unblock(uuid: User['uuid'], config: ServiceConfig<User> = {}): Promise<User> {
    try {
      return (await this.get(uuid, config)).merge({ isBanned: false }).save()
    } catch (err: Error | any) {
      throw err
    }
  }
}
