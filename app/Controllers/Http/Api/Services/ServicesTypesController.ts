import ResponseService from 'App/Services/ResponseService'
import ServicesType from 'App/Models/Services/ServicesType'
import ExceptionService from 'App/Services/ExceptionService'
import ServicesTypeService from 'App/Services/Services/ServicesTypeService'
import ServicesTypesSubService from 'App/Models/Services/ServicesTypesSubService'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServicesTypesController {
  public async all({ response }: HttpContextContract) {
    try {
      let servicesTypes: ServicesType[] = await ServicesTypeService.getAll()

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, servicesTypes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getAllSubServicesTypes({ response, params }: HttpContextContract) {
    const serviceTypeId: ServicesType['id'] = params.serviceTypeId

    try {
      let subServicesTypes: ServicesTypesSubService[] = await ServicesTypeService.getAllSubServicesTypes(serviceTypeId)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, subServicesTypes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getAllAttributesTypes({ response, params }: HttpContextContract) {
    const serviceTypeId: ServicesType['id'] = params.serviceTypeId

    try {
      let attributesTypes: ServicesTypesSubService[] = await ServicesTypeService.getAllAttributesTypes(serviceTypeId)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, attributesTypes))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
