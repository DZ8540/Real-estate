import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import RealEstateType from 'App/Models/RealEstates/RealEstateType'
import RealEstateTypeService from 'App/Services/RealEstates/RealEstateTypeService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RealEstateTypesController {
  public async all({ response }: HttpContextContract) {
    try {
      let realEstateTypes: RealEstateType[] = await RealEstateTypeService.getAll(['id', 'slug', 'name'], 'estates')

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, realEstateTypes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
