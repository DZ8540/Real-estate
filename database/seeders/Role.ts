import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'
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
