import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import Logger from '@ioc:Adonis/Core/Logger'
import ExceptionService from 'App/Services/ExceptionService'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'
import { CsvCity } from 'Contracts/cities'
import { Error } from 'Contracts/services'
import ResponseService from 'App/Services/ResponseService'

export default class CitiesController {
  public async getAll({ response }: HttpContextContract) {
    try {
      const cities: string[] = []
      const csvCities: Buffer = fs.readFileSync(__dirname + '/../../../../city.csv')
      const parsedCities: CsvCity[] = parse(csvCities, { columns: true })

      let i: number = 1
      for (const item of parsedCities) {
        Logger.info('Index:' + i)

        if (item.city) {
          cities.push(item.city)
        } else {
          if (!item.region)
            throw { code: ResponseCodes.SERVER_ERROR, message: ResponseMessages.CITY_UNDEFINED } as Error

          cities.push(item.region)
        }
        i++
      }

      return response.status(200).send(ResponseService.success(ResponseMessages.SUCCESS, cities))
    } catch (err: any) {
      Logger.error(err)
      throw new ExceptionService({
        code: ResponseCodes.SERVER_ERROR,
        message: ResponseMessages.ERROR,
      })
    }
  }
}
