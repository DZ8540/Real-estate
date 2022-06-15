import Drive from '@ioc:Adonis/Core/Drive'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { afterFetch, afterFind, BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Banner extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'description', 'image', 'createdAt', 'updatedAt'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public image: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  /**
   * * Hooks
   */

  @afterFind()
  public static async setImageUrl(item: Banner) {
    item.image = await Drive.getUrl(item.image)
  }

  @afterFetch()
  public static async setImagesUrl(banners: Banner[]) {
    await Promise.all(banners.map(async (item) => {
      item.image = await Drive.getUrl(item.image)
    }))
  }

  /**
   * * Computed properties
   */

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt.setLocale('ru-RU').toFormat('dd.MM.yy')
  }

  // ! Do not use this method!!!
  public async imageUrl(): Promise<string> {
    return this.image ? await Drive.getUrl(this.image) : IMG_PLACEHOLDER
  }
}
