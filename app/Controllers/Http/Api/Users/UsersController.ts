import User from 'App/Models/Users/User'
import UserService from 'App/Services/Users/UserService'
import UserValidator from 'App/Validators/Api/Users/User'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

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

  public async update({ request, params, response }: HttpContextContract) {
    let payload: UserValidator['schema']['props']
    let uuid: User['uuid'] = params.uuid

    try {
      payload = await request.validate(UserValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let item: User = await UserService.update(uuid, payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.USER_UPDATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async deleteAvatar({ params, response }: HttpContextContract) {
    let uuid: User['uuid'] = params.uuid

    try {
      let item: User = await UserService.deleteAvatar(uuid)

      return response.status(200).send(ResponseService.success(ResponseMessages.USER_AVATAR_DELETED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
