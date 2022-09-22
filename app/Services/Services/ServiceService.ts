import BaseService from '../BaseService'
import User from 'App/Models/Users/User'
import LabelService from './LabelService'
import Logger from '@ioc:Adonis/Core/Logger'
import Label from 'App/Models/Services/Label'
import Service from 'App/Models/Services/Service'
import Database from '@ioc:Adonis/Lucid/Database'
import ServicesTypeService from './ServicesTypeService'
import ServiceValidator from 'App/Validators/Services/ServiceValidator'
import ServiceApiValidator from 'App/Validators/Api/Services/ServiceValidator'
import ServicesTypesSubService from 'App/Models/Services/ServicesTypesSubService'
import { PaginationConfig } from 'Contracts/database'
import { ModelPaginatorContract } from '@ioc:Adonis/Lucid/Orm'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

// import { removeLastLetter } from '../../../helpers'

type Columns = typeof Service['columns'][number]
type ValidatorPayload = ServiceValidator['schema']['props']

export default class ServiceService extends BaseService {
  public static async paginate(config: PaginateConfig<Columns, Service>, columns: Columns[] = []): Promise<ModelPaginatorContract<Service>> {
    let query = Service.query().select(columns)

    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.get(config)
  }

  public static async get(id: Service['id'], config: ServiceConfig<Service> = {}): Promise<Service> {
    let item: Service | null

    try {
      item = await Service.find(id, { client: config.trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NEWS_NOT_FOUND } as Error
    }
  }

  public static async getUserServicesIds(userId: User['id']): Promise<Service['id'][]> {
    try {
      const services: Service[] = await Service
        .query()
        .select(['id'])
        .where('user_id', userId)
        .pojo()

      return services.map((item: Service) => item.id)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: ValidatorPayload, { trx }: ServiceConfig<Service> = {}): Promise<Service> {
    let item: Service

    // try {
    //   await this.checkUserServiceType(payload.userId, payload.servicesTypeId)
    // } catch (err: Error | any) {
    //   throw err
    // }

    if (!trx)
      trx = await Database.transaction()

    try {
      item = await Service.create(payload, { client: trx })
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (payload.labels) {
      let labels: string[] = payload.labels.split(', ')
      let labelsId: number[] = []
      for (let labelItem of labels) {
        try {
          let label: Label = await LabelService.getByName(labelItem)
          labelsId.push(label.id)
        } catch (err: Error | any) {
          let label: Label = await LabelService.create({ name: labelItem }, { trx })
          labelsId.push(label.id)
        }
      }

      try {
        await item.related('labels').attach(labelsId)
      } catch (err: any) {
        await trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
      }
    }

    await trx.commit()
    return item
  }

  public static async update(id: Service['id'], payload: ValidatorPayload, config: ServiceConfig<Service> = {}): Promise<Service> {
    let item: Service

    // try {
    //   await this.checkUserServiceType(payload.userId, payload.servicesTypeId)
    // } catch (err: Error | any) {
    //   throw err
    // }

    if (!config.trx)
      config.trx = await Database.transaction()

    try {
      item = await this.get(id, config)
    } catch (err: any) {
      await config.trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (payload.labels) {
      try {
        await item.related('labels').detach()
      } catch (err: any) {
        await config.trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
      }

      let labels: string[] = payload.labels.split(', ')
      let labelsId: number[] = []
      for (let labelItem of labels) {
        try {
          let label: Label = await LabelService.getByName(labelItem)
          labelsId.push(label.id)
        } catch (err: Error | any) {
          let label: Label = await LabelService.create({ name: labelItem }, { trx: config.trx })
          labelsId.push(label.id)
        }
      }

      try {
        await item.related('labels').attach(labelsId)
      } catch (err: any) {
        await config.trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
      }
    }

    try {
      item = await item.merge(payload).save()

      await config.trx.commit()
      return item
    } catch (err: any) {
      await config.trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(id: Service['id'], config: ServiceConfig<Service> = {}): Promise<void> {
    let item: Service

    try {
      item = await this.get(id, config)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.SERVICE_NOT_FOUND } as Error
    }
  }

  public static async search(payload: ServiceApiValidator['schema']['props'], searchQuery: string): Promise<ModelPaginatorContract<Service>> {
    if (!payload.limit)
      payload.limit = 4

    const paginatePayload: PaginationConfig = {
      page: payload.page,
      limit: payload.limit,
      orderBy: payload.orderBy,
    }

    try {
      let query = Service
        .query()
        .preload('user')
        .preload('labels')
        .preload('subService', (query) => {
          query.preload('type')
        })

      if (searchQuery) {
        query = query.whereHas('user', (query) => {
          query.withScopes((scopes) => scopes.search(searchQuery))
        })
      }

      for (let key in payload) {
        if (payload[key]) {
          switch (key) {
            // Skip this api's keys
            case 'page':
            case 'limit':
            case 'orderBy':
              break
            // Skip this api's keys

            // case 'experienceTypes':
            //   for (let item of payload[key]!) {
            //     query = query.andWhere(removeLastLetter(key), item!)
            //   }
            //   break

            case 'rating':
              query = query
                .join('users', 'services.user_id', 'users.id')
                .select('services.*')
                .orderBy('users.rating', payload[key])
              break

            case 'servicesTypeId':
              const subServices: ServicesTypesSubService[] = await ServicesTypeService.getAllSubServicesTypes(payload[key]!)
              const subServicesIds: ServicesTypesSubService['id'][] = subServices.map((item: ServicesTypesSubService) => item.id)

              query = query.whereHas('subService', (query) => {
                query.whereIn('id', subServicesIds)
              })
              break

            case 'subServicesTypes':
              query = query.whereHas('subService', (query) => {

                for (let item of payload[key]!) {
                  query.where('id', item)
                }

              })

              break

            case 'attributesTypes':
              query = query.whereHas('attribute', (query) => {

                for (let item of payload[key]!) {
                  query.where('id', item)
                }

              })

              break

            case 'labels':
              for (let item of payload[key]!) {
                query = query.whereHas('labels', (labelQuery) => {
                  labelQuery.where('label_id', item)
                })
              }
              break

            default:
              query = query.where(key, payload[key])
              break
          }
        }
      }

      return await query.get(paginatePayload)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  // private static async checkUserServiceType(userId: User['id'], currentServiceTypeId: Service['servicesTypeId']): Promise<void> {
  //   let user: User = await UserService.getById(userId, { relations: ['services'] })
  //   let serviceTypeId: Service['servicesTypeId'] = user.services[0].servicesTypeId

  //   if (currentServiceTypeId != serviceTypeId) {
  //     let message: ResponseMessages = ResponseMessages.SERVICE_TYPE_DIFFERENT

  //     Logger.error(message)
  //     throw { code: ResponseCodes.CLIENT_ERROR, message: message } as Error
  //   }
  // }
}
