import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ServicesTypesAttribute from 'App/Models/Services/ServicesTypesAttribute'

export default class ServicesTypesAttributeSeeder extends BaseSeeder {
  public async run () {
    try {
      await ServicesTypesAttribute.createMany([
        { name: 'первичное жилье', servicesTypeId: 1 },
        { name: 'вторичное жилье', servicesTypeId: 1 },
        { name: 'коммерческая недвижимость', servicesTypeId: 1 },
        { name: 'загородная недвижимость', servicesTypeId: 1 },
        { name: 'аренда', servicesTypeId: 1 },

        { name: 'только дизайн', servicesTypeId: 2 },
        { name: 'дизайн + сопровождение', servicesTypeId: 2 },

        { name: 'да', servicesTypeId: 4 },
        { name: 'нет', servicesTypeId: 4 },
      ])
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
