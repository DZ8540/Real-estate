import Message from './Message'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class MessagesImage extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = ['id', 'image', 'messageId', 'createdAt', 'updatedAt'] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public image: string

  @column({ columnName: 'message_id' })
  public messageId: Message['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
