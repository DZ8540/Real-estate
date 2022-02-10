import Logger from '@ioc:Adonis/Core/Logger'
import UsersReport from 'App/Models/UsersReport'
import { Error, GetAllConfig, GetConfig } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class UsersReportService {
  public static async paginate(config: GetAllConfig<typeof UsersReport['columns'][number], UsersReport>): Promise<UsersReport[]> {
    if (!config.columns)
      config.columns = ['id', 'fromId', 'toId', 'createdAt']

    let query = UsersReport.query()
    if (config.relations) {
      for (let item of config.relations) {
        query = query.preload(item)
      }
    }

    return await query.select(config.columns).get(config)
  }

  public static async get(config: GetConfig<UsersReport>): Promise<UsersReport> {
    let item: UsersReport | null

    try {
      item = await UsersReport.findBy(config.column, config.val, { client: config.trx })
    } catch (err: any) {
      await config.trx?.rollback()

      Logger.error(err)
      throw { code: ResponseCodes.DATABASE_ERROR, message: ResponseMessages.ERROR } as Error
    }

    if (!item) {
      await config.trx?.rollback()

      throw { code: ResponseCodes.CLIENT_ERROR, message: ResponseMessages.USERS_REPORT_NOT_FOUND } as Error
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

  public static async delete(config: GetConfig<UsersReport>): Promise<void> {
    let item: UsersReport

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
