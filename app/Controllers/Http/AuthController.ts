import User from 'App/Models/Users/User'
import Logger from '@ioc:Adonis/Core/Logger'
import AuthService from 'App/Services/AuthService'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import { Error } from 'Contracts/services'
import { SESSION_USER_KEY } from 'Contracts/auth'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ view, session, response }: HttpContextContract) {
    if (session.has(SESSION_USER_KEY))
      return response.redirect().back()

    return view.render('pages/auth/login')
  }

  public async loginAction({ request, session, response }: HttpContextContract) {
    let payload: LoginValidator['schema']['props']

    try {
      payload = await request.validate(LoginValidator)
    } catch (err: any) {
      session.flash({
        error: ResponseMessages.USER_NOT_FOUND,
        email: request.input('email', '')
      })

      return response.redirect().back()
    }

    try {
      let candidate: User = await AuthService.loginViaServer(payload)
      session.put(SESSION_USER_KEY, { ...candidate.toJSON(), avatar: await candidate.avatarUrl() })

      return response.redirect().toRoute('index')
    } catch (err: Error | any) {
      Logger.error(err)

      session.flash('error', err.message)

      return response.redirect().back()
    }
  }

  public async logout({ response, session }: HttpContextContract) {
    session.forget(SESSION_USER_KEY)

    return response.redirect().toRoute('login')
  }
}
