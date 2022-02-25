import Logger from '@ioc:Adonis/Core/Logger'
import RealEstatesReport from 'App/Models/RealEstates/RealEstatesReport'
import RealEstatesReportValidator from 'App/Validators/Api/RealEstates/RealEstatesReportValidator'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { Error, PaginateConfig, ServiceConfig } from 'Contracts/services'

type Columns = typeof RealEstatesReport['columns'][number]
type ValidatorPayload = RealEstatesReportValidator['schema']['props']

export default class RealEstatesReportService {
  public static async paginate(config: PaginateConfig<Columns, RealEstatesReport>, columns: Columns[] = ['id', 'realEstateId', 'userId', 'createdAt']): Promise<RealEstatesReport[]> {
    let query = RealEstatesReport.query()

    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.select(columns).get(config)
  }

  public static async get(payload: ValidatorPayload, config: ServiceConfig<RealEstatesReport> = {}): Promise<RealEstatesReport> {
    let item: RealEstatesReport | null

    try {
      item = await RealEstatesReport.query({ client: config.trx }).where('userId', payload.userId).andWhere('realEstateId', payload.realEstateId).first()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item) {
      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATES_REPORT_NOT_FOUND } as Error
    }

    try {
      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      return item
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async create(payload: ValidatorPayload, { trx }: ServiceConfig<RealEstatesReport> = {}): Promise<RealEstatesReport> {
    try {
      return await RealEstatesReport.create(payload, { client: trx })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(payload: ValidatorPayload, config: ServiceConfig<RealEstatesReport> = {}): Promise<void> {
    let item: RealEstatesReport

    try {
      item = await this.get(payload, config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
