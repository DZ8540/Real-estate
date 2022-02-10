import User from './User'
import UsersReview from './UsersReview'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class UsersReviewsReport extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'usersReviewId', 'userId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'usersReview_id' })
  public usersReviewId: UsersReview['id']

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt ? this.createdAt.setLocale('ru-RU').toFormat('dd.MM.yy') : 'Не установлено'
  }

  @belongsTo(() => UsersReview)
  public usersReview: BelongsTo<typeof UsersReview>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
