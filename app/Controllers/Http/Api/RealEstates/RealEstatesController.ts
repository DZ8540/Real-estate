import User from 'App/Models/Users/User'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import ExceptionService from 'App/Services/ExceptionService'
import RealEstateService from 'App/Services/RealEstates/RealEstateService'
import RealEstateValidator from 'App/Validators/RealEstates/RealEstateValidator'
import RealEstateApiValidator from 'App/Validators/Api/RealEstates/RealEstateValidator'
import RealEstatePopularValidator from 'App/Validators/Api/RealEstates/RealEstatePopularValidator'
import RealEstateRecommendedValidator from 'App/Validators/Api/RealEstates/RealEstateRecommendedValidator'
import { ModelObject } from '@ioc:Adonis/Lucid/Orm'
import { Error, JSONPaginate } from 'Contracts/services'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstatesController {
  public async all({ request, response, params }: HttpContextContract) {
    let payload: RealEstateApiValidator['schema']['props']
    const city: string = params.city
    const currentUserId: User['id'] | undefined = params.currentUserId

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
      let realEstates: JSONPaginate = await RealEstateService.search(city, payload)

      if (currentUserId)
        realEstates.data = await Promise.all(realEstates.data.map(async (item: RealEstate) => await item.getForUser(currentUserId)))

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, realEstates))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getForMap({ response, params }: HttpContextContract) {
    const city: string = params.city

    try {
      const realEstates: RealEstate[] = await RealEstateService.getForMap(city)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, realEstates))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getFromMap({ request, response, params }: HttpContextContract) {
    const currentUserId: User['id'] | undefined = params.currentUserId
    const realEstatesIdsArr: RealEstate['id'][] = request.input('realEstatesIds', [])

    try {
      const realEstates: ModelObject[] = await RealEstateService.getFromMap(realEstatesIdsArr, currentUserId)

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, realEstates))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async get({ params, response }: HttpContextContract) {
    const uuid: RealEstate['uuid'] = params.uuid
    const currentUserId: User['id'] | undefined = params.currentUserId

    try {
      let fullItem: ModelObject
      const item: RealEstate = await RealEstateService.get(uuid, { relations: ['images'], isForApi: true })
      await item.load('user', (query) => {
        query.withCount('realEstates')
      })
      const todayViewsCount: number = await RealEstateService.incrementTodayViewsCount(item)

      if (currentUserId)
        fullItem = { ...(await item.getForUser(currentUserId)), todayViewsCount }
      else
        fullItem = { ...item.serialize(), todayViewsCount }

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, fullItem))
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
      const item: RealEstate = await RealEstateService.create(payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATE_CREATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    let payload: RealEstateValidator['schema']['props']
    const uuid: RealEstate['uuid'] = params.uuid

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
      const item: RealEstate = await RealEstateService.update(uuid, payload)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATE_UPDATED, item))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async delete({ response, params }: HttpContextContract) {
    const uuid: RealEstate['uuid'] = params.uuid

    try {
      await RealEstateService.delete(uuid)

      return response.status(200).send(ResponseService.success(ResponseMessages.REAL_ESTATE_DELETED))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async popular({ request, response, params }: HttpContextContract) {
    let payload: RealEstatePopularValidator['schema']['props']
    const city: string = params.city
    const currentUserId: User['id'] | undefined = params.currentUserId

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
      const popularRealEstates: JSONPaginate = (await RealEstateService.popular(city, payload.limit)).toJSON()

      if (currentUserId)
        popularRealEstates.data = await Promise.all(popularRealEstates.data.map((item: RealEstate) => item.getForUser(currentUserId)))

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, popularRealEstates.data))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async recommended({ request, response, params }: HttpContextContract) {
    let payload: RealEstateRecommendedValidator['schema']['props']
    const city: string = params.city
    const currentUserId: User['id'] | undefined = params.currentUserId

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
      let recommended: RealEstate[] | ModelObject[] = await RealEstateService.recommended(city, payload)

      if (currentUserId)
        recommended = await Promise.all(recommended.map(async (item: RealEstate) => await item.getForUser(currentUserId)))

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, recommended))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }

  public async getUserRealEstates({ request, params, response }: HttpContextContract) {
    let config: ApiValidator['schema']['props']
    const userId: User['id'] = params.id
    const currentUserId: User['id'] = params.currentUserId ?? userId

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
      const realEstates: JSONPaginate = (await RealEstateService.getUserRealEstates(userId, config)).toJSON()

      realEstates.data = await Promise.all(realEstates.data.map(async (item: RealEstate) => await item.getForUser(currentUserId)))

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
      const wishlist: JSONPaginate = (await RealEstateService.getUserWishlist(userId, config)).toJSON()

      wishlist.data = await Promise.all(wishlist.data.map(async (item: RealEstate) => await item.getForUser(userId)))

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, wishlist))
    } catch (err: Error | any) {
      throw new ExceptionService(err)
    }
  }
}
