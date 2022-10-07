import RealEstateType from './RealEstateType'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { camelCase } from '../../../helpers'
import { BaseModel, beforeFetch, beforeFind, beforeSave, BelongsTo, belongsTo, column, computed, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class Estate extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'slug', 'name', 'realEstateTypeId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public slug: string

  @column()
  public name: string

  @column({ columnName: 'realEstateType_id' })
  public realEstateTypeId: RealEstateType['id'] | undefined

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get realEstateTypeForUser(): string {
    return this.realEstateType?.name ?? 'Не установлено'
  }

  @beforeSave()
  public static async setSlug(estate: Estate) {
    if (estate.$dirty.slug)
      estate.slug = camelCase(estate.slug)

    if (!estate.slug)
      estate.slug = camelCase(estate.name)
  }

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof Estate>) {
    query.preload('realEstateType')
  }

  @belongsTo(() => RealEstateType)
  public realEstateType: BelongsTo<typeof RealEstateType>
}
