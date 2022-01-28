import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { UserFactory } from 'Database/factories'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin@mail.ru',
        password: '1234Admin',
        isActivated: true
      },
      {
        firstName: 'Test',
        lastName: 'Test',
        email: 'test@mail.ru',
        password: '1234Test',
        isActivated: true
      }
    ])

    await UserFactory.createMany(50)
  }
}
