import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RealEstateType from 'App/Models/RealEstateType'

export default class RealEstateTypeSeeder extends BaseSeeder {
  public async run () {
    try {
      await RealEstateType.createMany([
        { name: 'Жилая' },
        { name: 'Коммерческая' },
        { name: 'Паркинг/Гараж' },
        { name: 'Земельный участок' },
      ])
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
