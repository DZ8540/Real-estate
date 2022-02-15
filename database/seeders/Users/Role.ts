import Role from 'App/Models/Users/Role'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { Roles } from 'Contracts/enums'

export default class RoleSeeder extends BaseSeeder {
  public async run () {
    await Role.createMany([
      { name: Roles.ADMIN },
      { name: Roles.MANAGER },
      { name: Roles.USER },
    ])
  }
}
