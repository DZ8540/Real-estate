import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
import User from 'App/Models/User'
import RoleService from 'App/Services/RoleService'
import Logger from '@ioc:Adonis/Core/Logger'
import { Roles } from 'Contracts/enums'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    let roles: Role[] = await RoleService.getAll()
    let adminRole: Role | undefined = roles.find(item => item.name == Roles.ADMIN)
    let managerRole: Role | undefined = roles.find(item => item.name == Roles.MANAGER)
    let userRole: Role | undefined = roles.find(item => item.name == Roles.USER)

    if (!adminRole) {
      Logger.error('Admin role is not defined!')
      return
    }

    if (!managerRole) {
      Logger.error('Manager role is not defined!')
      return
    }

    if (!userRole) {
      Logger.error('User role is not defined!')
      return
    }

    await User.createMany([
      {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@mail.ru',
        password: '1234Admin',
        isActivated: true,
        roleId: adminRole.id,
      },
      {
        firstName: 'Manager',
        lastName: 'Manager',
        email: 'manager@mail.ru',
        password: '1234Manager',
        isActivated: true,
        roleId: managerRole.id,
      },
      {
        firstName: 'User',
        lastName: 'User',
        email: 'user@mail.ru',
        password: '1234User',
        isActivated: true,
        roleId: userRole.id,
      }
    ])

    await UserFactory.createMany(50)
  }
}
