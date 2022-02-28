import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { camelCase } from '../../../helpers'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class ServicesType extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'slug', 'name', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public name: string

  @column.dateTime({
    autoCreate: true,
    serializeAs: null,
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @beforeSave()
  public static async setSlug(servicesType: ServicesType) {
    if (servicesType.$dirty.slug)
      servicesType.slug = camelCase(servicesType.slug)

    if (!servicesType.slug)
      servicesType.slug = camelCase(servicesType.name)
  }
}
