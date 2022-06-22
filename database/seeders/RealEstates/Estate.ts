import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { EstateFactory } from 'Database/factories'

export default class EstateSeeder extends BaseSeeder {
  public async run () {
    try {
      await EstateFactory.createMany(5)
    } catch (err) {
      Logger.error(err)
    }
  }
}
