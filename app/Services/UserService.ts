import User from 'App/Models/User'
import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import { GetAllConfig } from 'Contracts/services'

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
