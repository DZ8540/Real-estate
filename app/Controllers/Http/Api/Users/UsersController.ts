import User from 'App/Models/Users/User'
import UserService from 'App/Services/Users/UserService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async get({ params, response }: HttpContextContract) {
    let id: User['id'] = params.id

    try {
      let item: User = await UserService.getById(id, { relations: ['realEstates'] })
      await item.load('services', (profileQuery) => {
        profileQuery.preload('labels')
      })

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, item.serialize()))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
