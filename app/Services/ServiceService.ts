import Label from 'App/Models/Label'
import BaseService from './BaseService'
import Service from 'App/Models/Service'
import LabelService from './LabelService'
import Logger from '@ioc:Adonis/Core/Logger'
import Database from '@ioc:Adonis/Lucid/Database'
import ServiceValidator from 'App/Validators/ServiceValidator'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class ServiceService extends BaseService {
  public static async getAll(config: GetAllConfig<typeof Service['columns'][number]>): Promise<Service[]> {
    if (!config.columns)
      config.columns = ['id', 'experienceType', 'isBanned', 'userId', 'servicesTypeId', 'createdAt']

    return await Service.query().select(config.columns).preload('user').preload('servicesType').get(config)
  }

  public static async get({ column, val, trx, relations }: GetConfig<Service>): Promise<Service> {
    let item: Service | null

    try {
      item = await Service.findBy(column, val, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      if (relations) {
        for (let relationItem of relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.NEWS_NOT_FOUND } as Error
    }
  }

  public static async create(payload: ServiceValidator['schema']['props']): Promise<Service> {
    let item: Service | null
    let trx = await Database.transaction()

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
          let label: Label = await LabelService.get({ column: 'name', val: labelItem })
          labelsId.push(label.id)
        } catch (err: Error | any) {
          let label: Label = await LabelService.create({ name: labelItem }, trx)
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

  public static async update({ column, val }: GetConfig<Service>, payload: ServiceValidator['schema']['props']): Promise<Service> {
    let item: Service | null
    let trx = await Database.transaction()

    try {
      item = await Service.findBy(column, val, { client: trx })
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item) {
      await trx.rollback()
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.SERVICE_NOT_FOUND } as Error
    }

    if (payload.labels) {
      try {
        await item.related('labels').detach()
      } catch (err: any) {
        await trx.rollback()

        Logger.error(err)
        throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
      }

      let labels: string[] = payload.labels.split(', ')
      let labelsId: number[] = []
      for (let labelItem of labels) {
        try {
          let label: Label = await LabelService.get({ column: 'name', val: labelItem })
          labelsId.push(label.id)
        } catch (err: Error | any) {
          let label: Label = await LabelService.create({ name: labelItem }, trx)
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

    try {
      item = await item.merge(payload).save()

      await trx.commit()
      return item
    } catch (err: any) {
      await trx.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(column: typeof Service['columns'][number], val: any): Promise<void> {
    let item: Service | null

    try {
      item = await Service.findBy(column, val)
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    try {
      if (!item)
        throw new Error()

      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.SERVICE_NOT_FOUND } as Error
    }
  }
}
