import Dialog from './Dialog'
import MessagesImage from './MessagesImage'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

export default class Message extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'text', 'isRead',
    'isFromDeleted', 'isToDeleted',
    'isFromMessage', 'dialogId', 'createdAt',
    'updatedAt'
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public text: string

  @column()
  public isRead: boolean

  @column()
  public isFromDeleted: boolean

  @column()
  public isToDeleted: boolean

  @column()
  public isFromMessage: boolean

  @column({ columnName: 'dialog_id' })
  public dialogId: Dialog['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => MessagesImage)
  public images: HasMany<typeof MessagesImage>
}
