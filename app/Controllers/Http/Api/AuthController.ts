import User from 'App/Models/User'
import Database from '@ioc:Adonis/Lucid/Database'
import UserService from 'App/Services/UserService'
import AuthService from 'App/Services/AuthService'
import ResponseService from 'App/Services/ResponseService'
import RegisterValidator from 'App/Validators/RegisterValidator'
import ActivateUserValidator from 'App/Validators/ActivateUserValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    let user: User
    let payload: RegisterValidator['schema']['props']
    let trx = await Database.transaction()

    try {
      payload = await request.validate(RegisterValidator)
    } catch (err: any) {
      return response.status(400).send(ResponseService.validationError('Заполните пожалуйста все поля правильно!', err.messages))
    }

    try {
      user = await UserService.create(payload, trx)
    } catch (err: Error | any) {
      await trx.rollback()
      return response.status(500).send(ResponseService.databaseError(err.message))
    }

    try {
      await AuthService.sendActivationMail(user)
    } catch (err: Error | any) {
      await trx.rollback()
      return response.status(500).send(ResponseService.mailerError(err.message))
    }

    await trx.commit()
    return response.status(200).send(ResponseService.success('Вы успешно зарегистрировались, заявка на подтверждение аккаунта была отправлена на вашу почту!'))
  }

  public async activate({ request, response }: HttpContextContract) {
    let user: User
    let payload: ActivateUserValidator['schema']['props']

    try {
      payload = await request.validate(ActivateUserValidator)
    } catch (err: any) {
      return response.status(400).send(ResponseService.validationError('Пользователь не существует!'))
    }

    try {
      user = await UserService.activate(payload.user)
    } catch (err: Error | any) {
      return response.status(500).send(ResponseService.databaseError(err.message))
    }

    return response.status(200).send(ResponseService.success('Вы успешно активировали свой аккаунт!', user))
  }
}
