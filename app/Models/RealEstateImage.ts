import RealEstate from './RealEstate'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import Drive from '@ioc:Adonis/Core/Drive'
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { IMG_PLACEHOLDER } from 'Config/drive'

export default class RealEstateImage extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'image', 'realEstateId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  @column({ columnName: 'realEstate_id' })
  public realEstateId: RealEstate['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public async imageUrl(): Promise<string> {
    return this.image ? await Drive.getUrl(this.image) : IMG_PLACEHOLDER
  }
}
