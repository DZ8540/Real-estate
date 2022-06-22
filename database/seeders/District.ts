import District from 'App/Models/District'
import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class DistrictSeeder extends BaseSeeder {
  public async run () {
    try {
      // await DistrictFactory.createMany(30)

      await District.createMany([
        {
          city: 'Казань',
          name: 'Ново-Савиновский',
        },
        {
          city: 'Казань',
          name: 'Советский',
        },
        {
          city: 'Казань',
          name: 'Московский',
        },
        {
          city: 'Казань',
          name: 'Кировский',
        },
        {
          city: 'Казань',
          name: 'Авиастроительный',
        },
        {
          city: 'Казань',
          name: 'Приволжский',
        },
      ])
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
