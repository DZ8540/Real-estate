import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ServicesType from 'App/Models/Services/ServicesType'

export default class ServicesTypeSeeder extends BaseSeeder {
  public async run () {
    try {
      await ServicesType.createMany([
        { name: 'Услуги риелтора' },
        { name: 'Дизайн' },
        { name: 'Ремонт' },
        { name: 'Грузоперевозки' },
      ])
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
