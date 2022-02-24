import Logger from '@ioc:Adonis/Core/Logger'
import AuthService from 'App/Services/AuthService'
import { SESSION_USER_KEY, SessionUser } from 'Contracts/auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckUserForAdmin {
  public async handle({ response, session }: HttpContextContract, next: () => Promise<void>) {
    let errorMsg: string = 'Пользователь не найден!'

    try {
      let currentUser: SessionUser = session.get(SESSION_USER_KEY)

      if (!currentUser)
        throw new Error(errorMsg)

      await AuthService.checkAdmin(currentUser.uuid)
    } catch (err: Error | any) {
      Logger.error(err)

      session.forget(SESSION_USER_KEY)
      session.flash('error', errorMsg)

      response.redirect().toRoute('login')
    }

    await next()
  }
}
