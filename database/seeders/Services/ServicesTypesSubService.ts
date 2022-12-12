import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ServicesTypesSubService from 'App/Models/Services/ServicesTypesSubService'

export default class ServicesTypesSubServiceSeeder extends BaseSeeder {
  public async run () {
    try {
      await ServicesTypesSubService.createMany([
        { name: 'Агентства недвижимости', servicesTypeId: 1 },
        { name: 'Частный риелтор', servicesTypeId: 1 },
        { name: 'Геодезист', servicesTypeId: 1 },
        { name: 'Кадастровый инженер', servicesTypeId: 1 },
        { name: 'Оценщик', servicesTypeId: 1 },
        { name: 'Нотариус', servicesTypeId: 1 },
        { name: 'Страховщик', servicesTypeId: 1 },

        { name: 'дизайн интерьера', servicesTypeId: 2 },
        { name: 'дизайн экстерьера', servicesTypeId: 2 },
        { name: 'ландшафтный дизайн', servicesTypeId: 2 },

        { name: 'ремонт квартиры', servicesTypeId: 3 },
        { name: 'отделочные работы', servicesTypeId: 3 },
        { name: 'сборка и ремонт мебели', servicesTypeId: 3 },
        { name: 'электрика', servicesTypeId: 3 },
        { name: 'сантехника', servicesTypeId: 3 },
        { name: 'остекление', servicesTypeId: 3 },
        { name: 'установка техники', servicesTypeId: 3 },
        { name: 'уборка', servicesTypeId: 3 },
        { name: 'строительство', servicesTypeId: 3 },
        { name: 'интернет', servicesTypeId: 3 },

        { name: 'по городу', servicesTypeId: 4 },
        { name: 'межгород', servicesTypeId: 4 },
      ])
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
