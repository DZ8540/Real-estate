import User from 'App/Models/Users/User'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ExceptionService from 'App/Services/ExceptionService'
import RealEstateService from 'App/Services/RealEstates/RealEstateService'
import RealEstateApiValidator from 'App/Validators/Api/RealEstates/RealEstateValidator'
import RealEstatePopularValidator from 'App/Validators/Api/RealEstates/RealEstatePopularValidator'
import RealEstateRecommendedValidator from 'App/Validators/Api/RealEstates/RealEstateRecommendedValidator'
import { Error } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { ModelObject, ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import CreateRealEstateValidator from 'App/Validators/Api/RealEstates/CreateRealEstateValidator'

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
      let item: RealEstate = await RealEstateService.get(uuid, { relations: ['images', 'user'], isForApi: true })
      let todayViewsCount: number = await RealEstateService.incrementTodayViewsCount(item)

      let fullItem: ModelObject = { ...item.serialize(), todayViewsCount }

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, fullItem))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async create({ request, response }: HttpContextContract) {
    let payload: CreateRealEstateValidator['schema']['props']

    try {
      payload = await request.validate(CreateRealEstateValidator)
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
      let popularRealEstates: ModelPaginatorContract<RealEstate> = await RealEstateService.popular(payload.limit)
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

  public async getUserRealEstates({ request, params, response }: HttpContextContract) {
    let config: ApiValidator['schema']['props']
    const userId: User['id'] = params.id

    try {
      config = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.ERROR,
        body: err.messages,
      })
    }

    try {
      const realEstates: ModelPaginatorContract<RealEstate> = await RealEstateService.getUserRealEstates(userId, config)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, realEstates))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getUserWishlist({ request, params, response }: HttpContextContract) {
    let config: ApiValidator['schema']['props']
    const userId: User['id'] = params.id

    try {
      config = await request.validate(ApiValidator)
    } catch (err: any) {
      throw new ExceptionService({
        code: ResponseCodes.VALIDATION_ERROR,
        message: ResponseMessages.ERROR,
        body: err.messages,
      })
    }

    try {
      const wishlist: ModelPaginatorContract<RealEstate> = await RealEstateService.getUserWishlist(userId, config)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, wishlist))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
