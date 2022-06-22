import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'

export default class District extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'name', 'city', 'createdAt', 'updatedAt'] as const

  /**
   * * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public city: string

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

  @beforeSave()
  public static async propertiesToLowerCase(item: District) {
    if (item.$dirty.name)
      item.name = item.name.toLowerCase()

    if (item.$dirty.city)
      item.city = item.city.toLowerCase()
  }
}
