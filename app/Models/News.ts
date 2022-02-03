import Drive from '@ioc:Adonis/Core/Drive'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { createSlug } from '../../helpers'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { BaseModel, beforeSave, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class News extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'slug', 'title',
    'description', 'readingTime', 'image',
    'createdAt', 'updatedAt'
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public readingTime: number

  @column()
  public image: string | undefined

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get createdDate(): string {
    return this.createdAt.toFormat('dd.MM.yy')
  }

  @beforeSave()
  public static async setSlug(news: News) {
    if (news.$dirty.slug)
      news.slug = createSlug(news.slug)

    if (!news.slug)
      news.slug = createSlug(news.title)
  }

  @beforeSave()
  public static async setReadingTime(news: News) {
    if (news.readingTime && news.readingTime == 0)
      news.readingTime = 1
  }

  public async imageUrl(): Promise<string> {
    return this.image ? await Drive.getUrl(this.image) : IMG_PLACEHOLDER
  }
}
