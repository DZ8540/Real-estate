import User from 'App/Models/User'
import News from 'App/Models/News'
import Label from 'App/Models/Label'
import Estate from 'App/Models/Estate'
import Service from 'App/Models/Service'
import Factory from '@ioc:Adonis/Lucid/Factory'
import RoleService from 'App/Services/RoleService'
import ServicesType from 'App/Models/ServicesType'
import RealEstateType from 'App/Models/RealEstateType'
import { OwnerTypes, Roles } from 'Contracts/enums'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return RoleService.get(Roles.USER).then(item => {
      return {
        ownerType: faker.datatype.number(OwnerTypes.AGENT),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '1234Test',
        roleId: item.id,
      }
    })
  })
  .build()

export const NewsFactory = Factory
  .define(News, ({ faker }) => {
    return {
      title: faker.vehicle.vehicle(),
      description: faker.lorem.paragraphs(10),
      readingTime: faker.datatype.number(),
    }
  })
  .build()

export const EstateFactory = Factory
  .define(Estate, async ({ faker }) => {
    return {
      name: faker.lorem.word(),
      realEstateTypeId: (await RealEstateType.query().random()).id,
    }
  })
  .build()

export const LabelFactory = Factory
  .define(Label, async ({ faker }) => {
    return { name: faker.lorem.words(2) }
  })
  .build()

export const ServicesFactory = Factory
  .define(Service, async ({ faker }) => {
    return {
      experienceType: faker.datatype.number(3),
      description: faker.lorem.paragraphs(3),
      userId: (await User.query().random()).id,
      servicesTypeId: (await ServicesType.query().random()).id,
    }
  })
  .relation('labels', () => LabelFactory)
  .build()
