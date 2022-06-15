import User from 'App/Models/Users/User'
import BaseService from '../BaseService'
import Drive from '@ioc:Adonis/Core/Drive'
import Logger from '@ioc:Adonis/Core/Logger'
import UserValidator from 'App/Validators/Api/Users/User'
import RegisterValidator from 'App/Validators/Auth/RegisterValidator'
import { USERS_PATH } from 'Config/drive'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'
import { ExtractModelRelations, LucidRow, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'

type Columns = typeof User['columns'][number]

export default class UserService extends BaseService {
  public static async paginate(config: PaginateConfig<Columns>, columns: Columns[] = []): Promise<ModelPaginatorContract<User>> {
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
      await this.checkModelAndLoadModelRelations(item, config.relations)

      return item!
    } catch (err: Error | any) {
      throw err
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
      await this.checkModelAndLoadModelRelations(item, config.relations)

      return item!
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async getByEmail(email: User['email'], config: ServiceConfig<User> = {}): Promise<User> {
    let item: User | null

    try {
      item = await User.findBy('email', email, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await this.checkModelAndLoadModelRelations(item, config.relations)

      return item!
    } catch (err: Error | any) {
      throw err
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

  public static async update(uuid: User['uuid'], payload: UserValidator['schema']['props'], { trx }: ServiceConfig<User> = {}): Promise<User> {
    let item: User
    let avatar: string | null = null
    let avatarPath: string = `${USERS_PATH}/${uuid}`

    try {
      item = await this.get(uuid, { trx })
    } catch (err: Error | any) {
      throw err
    }

    if (payload.avatar) {
      try {
        await payload.avatar.moveToDisk(avatarPath)
        avatar = `${avatarPath}/${payload.avatar.fileName}`
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
      }
    }

    try {
      await item.merge({ ...payload, avatar }).save()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      return await this.get(uuid)
    } catch (err: Error | any) {
      throw err
    }
  }

  public static async deleteAvatar(uuid: User['uuid'], { trx }: ServiceConfig<User> = {}): Promise<User> {
    let item: User

    try {
      item = await this.get(uuid, { trx })
    } catch (err: Error | any) {
      throw err
    }

    if (item.avatar) {
      try {
        await Drive.delete(item.avatar)

        return await item.merge({ avatar: undefined }).save()
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
      }
    } else {
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_AVATAR_IS_EMPTY } as Error
    }
  }

  public static async activate(uuid: User['uuid'], config: ServiceConfig<User> = {}): Promise<void> {
    let item: User

    try {
      item = await this.get(uuid, config)
    } catch (err: Error | any) {
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

  private static async checkModelAndLoadModelRelations<M extends LucidRow>(model: M | null, relations: ExtractModelRelations<M>[] = []): Promise<void> {
    if (!model)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.ERROR } as Error

    if (relations) {
      try {
        for (let item of relations) {
          await model.load(item)
        }
      } catch (err: any) {
        Logger.error(err)
        throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USER_NOT_FOUND } as Error
      }
    }
  }
}
