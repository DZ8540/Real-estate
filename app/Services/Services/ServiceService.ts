import BaseService from '../BaseService'
import LabelService from './LabelService'
import Logger from '@ioc:Adonis/Core/Logger'
import Label from 'App/Models/Services/Label'
import Service from 'App/Models/Services/Service'
import Database from '@ioc:Adonis/Lucid/Database'
import ServiceValidator from 'App/Validators/Services/ServiceValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

export default class ServiceService extends BaseService {
  public static async getAll(config: PaginateConfig<typeof Service['columns'][number], Service>, columns: typeof Service['columns'][number][] = ['id', 'experienceType', 'isBanned', 'userId', 'servicesTypeId', 'createdAt']): Promise<Service[]> {
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

  public static async create(payload: ServiceValidator['schema']['props'], { trx }: ServiceConfig<Service> = {}): Promise<Service> {
    let item: Service

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

  public static async update(id: Service['id'], payload: ServiceValidator['schema']['props'], config: ServiceConfig<Service> = {}): Promise<Service> {
    let item: Service

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
}
