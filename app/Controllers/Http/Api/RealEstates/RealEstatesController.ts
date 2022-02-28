import RealEstate from 'App/Models/RealEstates/RealEstate'
import ResponseService from 'App/Services/ResponseService'
import ExceptionService from 'App/Services/ExceptionService'
import RealEstateService from 'App/Services/RealEstates/RealEstateService'
import RealEstateValidator from 'App/Validators/RealEstates/RealEstateValidator'
import RealEstateApiValidator from 'App/Validators/Api/RealEstates/RealEstateValidator'
import RealEstatePopularValidator from 'App/Validators/Api/RealEstates/RealEstatePopularValidator'
import RealEstateRecommendedValidator from 'App/Validators/Api/RealEstates/RealEstateRecommendedValidator'
import { Error } from 'Contracts/services'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstatesController {
  public async all({ request, response }: HttpContextContract) {
    let payload: RealEstateApiValidator['schema']['props']

    try {
      payload = await request.validate(RealEstateApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let realEstates: RealEstate[] = await RealEstateService.search(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, realEstates))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.uuid

    try {
      let item: RealEstate = await RealEstateService.get(uuid, { relations: ['images', 'user'] })

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: RealEstateValidator['schema']['props']

    try {
      payload = await request.validate(RealEstateValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let item: RealEstate = await RealEstateService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATE_CREATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async popular({ request, response }: HttpContextContract) {
    let payload: RealEstatePopularValidator['schema']['props']

    try {
      payload = await request.validate(RealEstatePopularValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let popularRealEstates: ModelPaginatorContract<RealEstate> = await RealEstateService.getAll({ page: 1, limit: payload.limit, orderByColumn: 'viewsCount', orderBy: 'desc' }, [])
      let data = popularRealEstates.toJSON().data

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async recommended({ request, response }: HttpContextContract) {
    let payload: RealEstateRecommendedValidator['schema']['props']

    try {
      payload = await request.validate(RealEstateRecommendedValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.VALIDATION_ERROR,
        body: err.messages
      })
    }

    try {
      let recommended: RealEstate[] = await RealEstateService.recommended(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, recommended))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
