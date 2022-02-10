import User from './User'
import RealEstate from './RealEstate'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class RealEstatesReport extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'userId', 'realEstateId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'user_id' })
  public userId: number

  @column({ columnName: 'realEstate_id' })
  public realEstateId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt ? this.createdAt.setLocale('ru-RU').toFormat('d MMMM, yyyy') : 'Не установлено'
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => RealEstate)
  public realEstate: BelongsTo<typeof RealEstate>
}
