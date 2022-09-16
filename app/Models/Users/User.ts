import Role from './Role'
import UsersReport from './UsersReport'
import UsersReview from './UsersReview'
import Hash from '@ioc:Adonis/Core/Hash'
import Service from '../Services/Service'
import Drive from '@ioc:Adonis/Core/Drive'
import Database from '@ioc:Adonis/Lucid/Database'
import RealEstate from '../RealEstates/RealEstate'
import RoleService from 'App/Services/Users/RoleService'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { Roles } from 'Config/users'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { OWNER_TYPES, SEX_TYPES } from 'Config/users'
import {
  BaseModel, beforeSave, BelongsTo,
  belongsTo, column, computed,
  HasMany,
  hasMany,
  ManyToMany, manyToMany, ModelObject, scope
} from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'uuid', 'ownerType', 'firstName', 'lastName',
    'sex', 'birthday', 'phone',
    'email', 'avatar', 'rating',
    'password', 'isSubscribed', 'isBanned',
    'companyName', 'taxIdentificationNumber',
    'isActivated', 'roleId', 'createdAt', 'updatedAt'
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public ownerType: number

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
  public avatar?: string | null

  @column()
  public companyName?: string

  @column()
  public taxIdentificationNumber?: number

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

  @column({ columnName: 'role_id' })
  public roleId: Role['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @column({ columnName: 'realEstates_count' })
  public realEstatesCount?: number

  @computed()
  public get ownerTypeForUser(): string {
    return OWNER_TYPES[this.ownerType]
  }

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
    return this.createdAt?.setLocale('ru-RU').toFormat('dd.MM.yyyy')
  }

  @computed()
  public get birthdayForUser(): string {
    if (this.birthday)
      return this.birthday.setLocale('ru-RU').toFormat('dd.MM.yyyy')

    return 'Не установлен'
  }

  @computed()
  public get phoneForUser(): string {
    return this.phone ?? 'Не установлен'
  }

  @computed()
  public get sexForUser(): string {
    if (typeof this.sex == 'number')
      return SEX_TYPES[this.sex]

    return 'Не установлен'
  }

  public static search = scope((query, text: string) => {
    const parts: string[] = text.split(' ')

    if (parts.length == 1) {
      query
        .where('firstName', 'ILIKE', `%${parts[0]}%`)
        .orWhere('firstName', 'ILIKE', `%${parts[1]}%`)
        .orWhere('lastName', 'ILIKE', `%${parts[0]}%`)
        .orWhere('lastName', 'ILIKE', `%${parts[1]}%`)
    } else {
      query
        .where('firstName', 'ILIKE', `%${parts[0]}%`)
        .andWhere('lastName', 'ILIKE', `%${parts[1]}%`)
    }
  })

  @beforeSave()
  public static createUuid(user: User) {
    if (!user.uuid)
      user.uuid = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password)
      user.password = await Hash.make(user.password)
  }

  @beforeSave()
  public static async setRole(user: User) {
    if (!user.$dirty.roleId && !user.roleId) {
      let userRole: Role = await RoleService.get(Roles.USER)
      user.roleId = userRole.id
    }
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @hasMany(() => Service)
  public services: HasMany<typeof Service>

  @hasMany(() => RealEstate)
  public realEstates: HasMany<typeof RealEstate>

  @manyToMany(() => RealEstate, {
    pivotTable: 'realEstatesWishlists',
    pivotRelatedForeignKey: 'realEstate_id',
  })
  public realEstatesWishList: ManyToMany<typeof RealEstate>

  @manyToMany(() => RealEstate, {
    pivotTable: 'realEstatesReports',
    pivotRelatedForeignKey: 'realEstate_id',
  })
  public realEstatesReports: ManyToMany<typeof RealEstate>

  public async avatarUrl(): Promise<string> {
    return this.avatar ? await Drive.getUrl(this.avatar) : IMG_PLACEHOLDER
  }

  public serializeForToken(): ModelObject {
    return this.serialize({
      fields: {
        omit: [
          'isBanned', 'createdAt', 'isActivated',
          'roleId', 'updatedAt', 'isActivatedForUser',
          'isBannedForUser'
        ] as typeof User['columns'][number][],
      },
      relations: {
        realEstatesWishList: {
          fields: ['id'],
        },
        realEstatesReports: {
          fields: ['id'],
        }
      }
    })
  }

  public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
    const item: ModelObject = { ...this.serialize() }

    const isInReports: UsersReport | undefined = await Database
      .from('usersReports')
      .where('from_id', currentUserId)
      .andWhere('to_id', item.id)
      .first()

    const isInReviews: UsersReview | undefined = await Database
      .from('usersReviews')
      .where('from_id', currentUserId)
      .andWhere('to_id', item.id)
      .first()

    item.reportStatus = isInReports ? true : false
    item.reviewStatus = isInReviews ? true : false

    return item
  }
}
