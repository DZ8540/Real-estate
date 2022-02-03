import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new BaseException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class BaseException extends Exception {
  protected body?: any

  constructor(message: string, body?: any, status?: number, code?: string) {
    super(message, status, code)

    this.body = body
  }

  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).send({
      status: error.status,
      code: error.code,
      message: error.message,
      body: error.body
    })
  }
}
