import User from 'App/Models/Users/User'
import UserService from 'App/Services/Users/UserService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index({ view, request, route }: HttpContextContract) {
    let page: number = request.input('page', 1)

    let columns: typeof User['columns'][number][] = ['id', 'uuid', 'firstName', 'lastName', 'email', 'isBanned', 'createdAt']
    let users: User[] = await UserService.paginate({ page, baseURL: route!.pattern }, columns)

    return view.render('pages/users/index', { users })
  }

  public async show({ view, params, session, response }: HttpContextContract) {
    let uuid: User['uuid'] = params.uuid

    try {
      let item: User = await UserService.get(uuid)

      return view.render('pages/users/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async block({ response, params, session }: HttpContextContract) {
    let uuid: User['uuid'] = params.uuid

    try {
      await UserService.block(uuid)

      session.flash('success', ResponseMessages.USER_BLOCKED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unblock({ response, params, session }: HttpContextContract) {
    let uuid: User['uuid'] = params.uuid

    try {
      await UserService.unblock(uuid)

      session.flash('success', ResponseMessages.USER_UNBLOCKED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
