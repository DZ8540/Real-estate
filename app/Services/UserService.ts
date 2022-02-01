import User from 'App/Models/User'
import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import RegisterValidator from 'App/Validators/RegisterValidator'
import { GetAllConfig } from 'Contracts/services'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

export default class UserService extends BaseService {
  public static async getAll({ page, limit, columns, baseURL }: GetAllConfig<typeof User['columns'][number][]>): Promise<User[]> {
    if (!columns)
      columns = ['id', 'firstName', 'lastName', 'email', 'isBanned']

    let users = await User.query().select(columns).get({ page, limit, baseURL })
    return users
  }

  public static async get(id: User['id']): Promise<User> {
    return await this.checkUser(id)
  }

  public static async create(payload: RegisterValidator['schema']['props'], trx?: TransactionClientContract): Promise<User> {
    try {
      return await User.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw new Error('Что-то пошло не так, повторите попытку еще раз!')
    }
  }

  public static async activate(uuid: User['uuid']): Promise<User> {
    let item: User

    try {
      item = (await User.findBy('uuid', uuid))!
    } catch (err: any) {
      Logger.error(err)
      throw new Error('Что-то пошло не так, повторите попытку еще раз!')
    }

    try {
      if (item.isActivated)
        throw new Error('Пользователь уже активирован!')
    } catch (err: Error | any) {
      throw new Error(err.message)
    }

    try {
      item.isActivated = true
      return await item.save()
    } catch (err: any) {
      Logger.error(err)
      throw new Error('Что-то пошло не так, повторите попытку еще раз!')
    }
  }

  public static async block(id: User['id']): Promise<void> {
    (await this.checkUser(id)).merge({ isBanned: true }).save()
  }

  public static async unblock(id: User['id']): Promise<void> {
    (await this.checkUser(id)).merge({ isBanned: false }).save()
  }

  private static async checkUser(id: User['id']): Promise<User> {
    try {
      return (await User.find(id))!
    } catch (err: any) {
      Logger.error(err)
      throw new Error('Пользователь не найден!')
    }
  }
}
