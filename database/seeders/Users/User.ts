import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RoleService from 'App/Services/Users/RoleService'
import { Roles } from 'Config/users'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    let adminRole: Role | null = await RoleService.get(Roles.ADMIN)
    let managerRole: Role | null = await RoleService.get(Roles.MANAGER)

    if (!adminRole) {
      Logger.error('Admin role is not defined!')
      return
    }

    if (!managerRole) {
      Logger.error('Manager role is not defined!')
      return
    }

    await User.createMany([
      {
        ownerType: 0,
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@mail.ru',
        password: '1234Admin',
        isActivated: true,
        roleId: adminRole.id,
      },
      {
        ownerType: 0,
        firstName: 'Manager',
        lastName: 'Manager',
        email: 'manager@mail.ru',
        password: '1234Manager',
        isActivated: true,
        roleId: managerRole.id,
      },
      {
        ownerType: 0,
        firstName: 'User',
        lastName: 'User',
        email: 'user@mail.ru',
        password: '1234User',
        isActivated: true,
      }
    ])

    await UserFactory.with('realEstatesWishList', 4).createMany(50)
  }
}
