import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IndexController {
  public async checkServer({ response }: HttpContextContract) {
    return response.status(200).send('It\'s work!')
  }
}
