import User from 'App/Models/User'
import Logger from '@ioc:Adonis/Core/Logger'
import AuthService from 'App/Services/AuthService'
import LoginValidator from 'App/Validators/LoginValidator'
import { SessionUser, SESSION_USER_KEY } from 'Contracts/auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ view, session, response }: HttpContextContract) {
    if (session.has(SESSION_USER_KEY))
      return response.redirect().back()

    return view.render('pages/auth/login')
  }

  public async loginAction({ request, session, response }: HttpContextContract) {
    try {
      let payload = await request.validate(LoginValidator)

      let candidate: User = await AuthService.login(payload)
      session.put(SESSION_USER_KEY, { id: candidate.id, fullName: candidate.fullName } as SessionUser)

      return response.redirect().toRoute('index')
    } catch (err: Error | any) {
      Logger.error(err)

      session.flash({
        error: 'Пользователь не найден!',
        email: request.input('email', '')
      })

      return response.redirect().back()
    }
  }

  public async logout({ response, session }: HttpContextContract) {
    session.forget(SESSION_USER_KEY)

    return response.redirect().toRoute('login')
  }
}
