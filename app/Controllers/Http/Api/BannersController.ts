import Banner from 'App/Models/Banner'
import BannerService from 'App/Services/BannerService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BannersController {
  public async getAll({ response }: HttpContextContract) {
    try {
      let banners: Banner[] = await BannerService.getAll()

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, banners))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
