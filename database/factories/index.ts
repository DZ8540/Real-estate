import User from 'App/Models/User'
import News from 'App/Models/News'
import Factory from '@ioc:Adonis/Lucid/Factory'
import RoleService from 'App/Services/RoleService'
import { Roles } from 'Contracts/enums'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return RoleService.get(Roles.USER).then(item => {
      return {
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
