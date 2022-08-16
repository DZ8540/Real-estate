import Response from './Response'
import Drive from '@ioc:Adonis/Core/Drive'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { afterFetch, afterFind, BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

// Not need use at now
export default class ResponsesImage extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'image', 'responseId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  @column({ columnName: 'response_id' })
  public responseId: Response['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterFind()
  public static async setImageUrl(item: ResponsesImage) {
    item.image = await Drive.getUrl(item.image)
  }

  @afterFetch()
  public static async setImagesUrl(images: ResponsesImage[]) {
    await Promise.all(images.map(async (item) => {
      item.image = await Drive.getUrl(item.image)
    }))
  }
}
