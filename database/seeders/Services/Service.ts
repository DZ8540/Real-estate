import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { ServicesFactory } from 'Database/factories'

export default class ServiceSeeder extends BaseSeeder {
  public async run () {
    try {
      await ServicesFactory.with('labels', 3).createMany(50)
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
