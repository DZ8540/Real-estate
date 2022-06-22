import District from 'App/Models/District'
import DistrictService from 'App/Services/DistrictService'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DistrictsController {
  public async getAll({ response, params }: HttpContextContract) {
    const city: District['city'] = decodeURIComponent(params.city)

    try {
      const districts: District[] = await DistrictService.getAllByCity(city)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, districts))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
