import Estate from 'App/Models/RealEstates/Estate'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import EstateService from 'App/Services/RealEstates/EstateService'
import RealEstateService from 'App/Services/RealEstates/RealEstateService'
import RealEstateValidator from 'App/Validators/RealEstates/RealEstateValidator'
import { Error } from 'Contracts/services'
import { ResponseMessages } from 'Contracts/response'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  BALCONY_TYPES, ELEVATOR_TYPES, HOUSE_BUILDING_TYPES,
  HOUSE_TYPES, LAYOUT_TYPES, REPAIR_TYPES,
  ROOM_TYPES, TRANSACTION_TYPES, WC_TYPES,
  PREPAYMENT_TYPES, RENTAL_TYPES,
} from 'Config/realEstatesTypes'

export default class RealEstatesController {
  public async index({ view, request, route }: HttpContextContract) {
    let baseURL: string = route!.pattern
    let page: number = request.input('page', 1)
    let realEstates: RealEstate[] = await RealEstateService.getAll({ baseURL, page, relations: ['user'] })

    return view.render('pages/realEstates/index', { realEstates })
  }

  // public async create({}: HttpContextContract) {}

  // public async store({}: HttpContextContract) {}

  public async show({ params, view, session, response }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.id

    try {
      let item: RealEstate = await RealEstateService.get(uuid, { relations: ['user', 'estate', 'images'] })

      return view.render('pages/realEstates/show', { item })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async edit({ params, view, session, response }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.id

    try {
      let estates: Estate[] = await EstateService.getAll(['id', 'name', 'realEstateTypeId'], { relations: ['realEstateType'] })
      let item: RealEstate = await RealEstateService.get(uuid, { relations: ['user', 'images'] })

      return view.render('pages/realEstates/edit', {
        item, estates, TRANSACTION_TYPES,
        HOUSE_TYPES, ROOM_TYPES, WC_TYPES,
        BALCONY_TYPES, LAYOUT_TYPES, REPAIR_TYPES,
        HOUSE_BUILDING_TYPES, ELEVATOR_TYPES, PREPAYMENT_TYPES,
        RENTAL_TYPES,
      })
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async update({ request, response, session, params }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.id
    let payload = await request.validate(RealEstateValidator)

    try {
      await RealEstateService.update(uuid, payload)

      session.flash('success', ResponseMessages.REAL_ESTATE_UPDATED)
      return response.redirect().toRoute('real_estates.index')
    } catch (err: Error | any) {
      session.flash('error', err.message)
      return response.redirect().back()
    }
  }

  public async destroy({ session, response, params }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.id

    try {
      await RealEstateService.delete(uuid)

      session.flash('success', ResponseMessages.REAL_ESTATE_DELETED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async block({ params, response, session }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.id

    try {
      await RealEstateService.block(uuid)

      session.flash('success', ResponseMessages.REAL_ESTATE_BLOCKED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }

  public async unblock({ params, response, session }: HttpContextContract) {
    let uuid: RealEstate['uuid'] = params.id

    try {
      await RealEstateService.unblock(uuid)

      session.flash('success', ResponseMessages.REAL_ESTATE_UNBLOCKED)
    } catch (err: Error | any) {
      session.flash('error', err.message)
    }

    return response.redirect().back()
  }
}
