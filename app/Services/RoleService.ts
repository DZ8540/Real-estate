import Role from 'App/Models/Role'
import BaseService from './BaseService'
import { Roles } from 'Contracts/enums'

export default class RoleService extends BaseService {
  public static async getAll(): Promise<Role[]> {
    return await Role.all()
  }

  public static async get(name: Roles): Promise<Role> {
    try {
      return (await Role.findBy('name', name))!
    } catch (err: any) {
      throw new Error('Роль не найдена!')
    }
  }
}
