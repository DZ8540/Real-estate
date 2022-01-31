import Factory from '@ioc:Adonis/Lucid/Factory'
import User from 'App/Models/User'
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
