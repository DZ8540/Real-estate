import Logger from '@ioc:Adonis/Core/Logger'
import RealEstatesReport from 'App/Models/RealEstates/RealEstatesReport'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class RealEstatesReportService {
  public static async paginate(config: GetAllConfig<typeof RealEstatesReport['columns'][number], RealEstatesReport>): Promise<RealEstatesReport[]> {
    if (!config.columns)
      config.columns = ['id', 'realEstateId', 'userId', 'createdAt']

    let query = RealEstatesReport.query()
    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.select(config.columns).get(config)
  }

  public static async get(config: GetConfig<RealEstatesReport>): Promise<RealEstatesReport> {
    let item: RealEstatesReport | null

    try {
      item = await RealEstatesReport.findBy(config.column, config.val, { client: config.trx })
    } catch (err: any) {
      await config.trx?.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item) {
      await config.trx?.rollback()

      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.REAL_ESTATES_REPORT_NOT_FOUND } as Error
    }

    try {
      if (config.relations) {
        for (let relationItem of config.relations) {
          await item.load(relationItem)
        }
      }

      await config.trx?.commit()
      return item
    } catch (err: any) {
      await config.trx?.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }

  public static async delete(config: GetConfig<RealEstatesReport>): Promise<void> {
    let item: RealEstatesReport

    try {
      item = await this.get(config)
    } catch (err: Error | any) {
      throw err
    }

    try {
      await item.delete()

      await config.trx?.commit()
    } catch (err: any) {
      await config.trx?.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }
  }
}
