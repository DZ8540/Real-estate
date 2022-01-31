import Role from './Role'
import Hash from '@ioc:Adonis/Core/Hash'
import Drive from '@ioc:Adonis/Core/Drive'
import CamelCaseNamingStrategy from '../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { Sex } from 'Contracts/enums'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'firstName', 'lastName',
    'sex', 'birthday', 'phone',
    'email', 'avatar', 'rating',
    'password', 'isSubscribed', 'isBanned',
    'isActivated', 'roleId', 'createdAt', 'updatedAt'
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public sex: number | undefined

  @column.date()
  public birthday: DateTime | undefined

  @column()
  public phone: string | undefined

  @column()
  public email: string

  @column()
  public avatar: string | undefined

  @column()
  public rating: number

  @column({ serializeAs: null })
  public password: string

  @column()
  public isSubscribed: boolean

  @column()
  public isBanned: boolean

  @column()
  public isActivated: boolean

  @column({
    columnName: 'role_id'
  })
  public roleId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  @computed()
  public get isActivatedForUser(): string {
    return this.isActivated ? 'Да' : 'Нет'
  }

  @computed()
  public get isSubscribedForUser(): string {
    return this.isSubscribed ? 'Да' : 'Нет'
  }

  @computed()
  public get isBannedForUser(): string {
    return this.isBanned ? 'Да' : 'Нет'
  }

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt.toFormat('yyyy.MM.dd')
  }

  @computed()
  public get birthdayForUser(): string {
    if (this.birthday)
      return this.birthday.toFormat('yyyy.MM.dd')

    return 'Не установлен'
  }

  @computed()
  public get phoneForUser(): string {
    return this.phone ?? 'Не установлен'
  }

  @computed()
  public get sexForUser(): string | null {
    switch (this.sex) {
      case Sex.MAN:
        return 'Мужской'
      case Sex.WOMAN:
        return 'Женский'
      default:
        return 'Не установлен'
    }
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password)
      user.password = await Hash.make(user.password)
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  public async avatarUrl(): Promise<string> {
    return this.avatar ? await Drive.getUrl(this.avatar) : IMG_PLACEHOLDER
  }
}
