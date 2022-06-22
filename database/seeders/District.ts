import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { DistrictFactory } from 'Database/factories'

export default class DistrictSeeder extends BaseSeeder {
  public async run () {
    try {
      await DistrictFactory.createMany(30)
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
