import User from './User'
import Database from '@ioc:Adonis/Lucid/Database'
import UsersReviewsReport from './UsersReviewsReport'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import {
  BaseModel, beforeFetch, beforeFind,
  BelongsTo, belongsTo, column,
  computed, ModelObject, ModelQueryBuilderContract
} from '@ioc:Adonis/Lucid/Orm'

export default class UsersReview extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'rating', 'description', 'fromId', 'toId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public rating: number

  @column()
  public description: string | undefined

  @column({ columnName: 'from_id' })
  public fromId: User['id']

  @column({ columnName: 'to_id' })
  public toId: User['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt ? this.createdAt.setLocale('ru-RU').toFormat('dd.MM.yy') : 'Не установлено'
  }

  @belongsTo(() => User, {
    foreignKey: 'fromId',
  })
  public from: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'toId',
  })
  public to: BelongsTo<typeof User>

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof UsersReview>) {
    query.preload('from')
  }

  public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
    const item: ModelObject = { ...this.serialize() }

    const isInReports: UsersReviewsReport | undefined = await Database
      .from('usersReviewsReports')
      .where('user_id', currentUserId)
      .andWhere('usersReview_id', item.id)
      .first()

    item.reportStatus = isInReports ? true : false

    return item
  }
}
