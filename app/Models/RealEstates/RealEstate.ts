import Estate from './Estate'
import User from '../Users/User'
import Drive from '@ioc:Adonis/Core/Drive'
import RealEstateImage from './RealEstateImage'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { IMG_PLACEHOLDER } from 'Config/drive'
import { BaseModel, beforeSave, BelongsTo, belongsTo, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import {
  BALCONY_TYPES, ELEVATOR_TYPES, HOUSE_BUILDING_TYPES,
  HOUSE_TYPES, LAYOUT_TYPES, PREPAYMENT_TYPES,
  RENTAL_TYPES, REPAIR_TYPES, ROOM_TYPES,
  TRANSACTION_TYPES, WC_TYPES
} from 'Config/realEstatesTypes'

export default class RealEstate extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'uuid', 'transactionType', 'isCountersSeparately',
    'pledge', 'prepaymentType', 'commission',
    'address', 'houseType', 'roomType',
    'totalArea', 'floor', 'WCType',
    'balconyType', 'layoutType', 'repairType',
    'hasKitchenFurniture', 'hasFurniture', 'hasRefrigerator',
    'hasWashingMachine', 'hasDishWasher', 'hasTV',
    'hasConditioner', 'hasInternet', 'hasBathroom',
    'hasShowerCabin', 'withKids', 'withPets',
    'description', 'image', 'houseBuildingType',
    'elevatorType', 'hasRamp', 'hasGarbage',
    'hasGroundParking', 'hasUnderGroundParking', 'hasMoreLayerParking',
    'price', 'isMortgage', 'isEncumbrances',
    'viewsCount', 'isVip', 'isHot', 'isBanned',
    'rentalType', 'communalPrice', 'residentalComplex',
    'livingArea', 'kitchenArea', 'maxFloor',
    'yearOfConstruction', 'ceilingHeight', 'metro',
    'userId', 'estateId', 'createdAt',
    'updatedAt'
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public transactionType: number

  @column()
  public isCountersSeparately: boolean

  @column()
  public pledge: number

  @column()
  public prepaymentType: number

  @column()
  public commission: number

  @column()
  public address: string

  @column()
  public houseType: number

  @column()
  public roomType: number

  @column()
  public totalArea: number

  @column()
  public floor: number

  @column({ columnName: 'WCType' })
  public WCType: number

  @column()
  public balconyType: number

  @column()
  public layoutType: number

  @column()
  public repairType: number

  @column()
  public hasKitchenFurniture: boolean

  @column()
  public hasFurniture: boolean

  @column()
  public hasRefrigerator: boolean

  @column()
  public hasWashingMachine: boolean

  @column()
  public hasDishWasher: boolean

  @column()
  public hasTV: boolean

  @column()
  public hasConditioner: boolean

  @column()
  public hasInternet: boolean

  @column()
  public hasBathroom: boolean

  @column()
  public hasShowerCabin: boolean

  @column()
  public withKids: boolean

  @column()
  public withPets: boolean

  @column()
  public description: string

  @column()
  public houseBuildingType: number

  @column()
  public elevatorType: number

  @column()
  public hasRamp: boolean

  @column()
  public hasGarbage: boolean

  @column()
  public hasGroundParking: boolean

  @column()
  public hasUnderGroundParking: boolean

  @column()
  public hasMoreLayerParking: boolean

  @column()
  public price: number

  @column()
  public isMortgage: boolean

  @column()
  public isEncumbrances: boolean

  @column()
  public viewsCount: number

  @column()
  public isVip: boolean

  @column()
  public isHot: boolean

  @column()
  public isBanned: boolean

  @column()
  public image: string | undefined

  @column()
  public rentalType: number | undefined

  @column()
  public communalPrice: number | undefined

  @column()
  public residentalComplex: string | undefined

  @column()
  public livingArea: number | undefined

  @column()
  public kitchenArea: number | undefined

  @column()
  public maxFloor: number | undefined

  @column.date()
  public yearOfConstruction: DateTime | undefined

  @column()
  public ceilingHeight: number | undefined

  @column()
  public metro: string | undefined

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'estate_id' })
  public estateId: Estate['id']

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serializeAs: null,
  })
  public updatedAt: DateTime

  @computed()
  public get transactionTypeForUser(): string {
    return TRANSACTION_TYPES[this.transactionType]
  }

  @computed()
  public get prepaymentTypeForUser(): string {
    return PREPAYMENT_TYPES[this.prepaymentType]
  }

  @computed()
  public get commissionForUser(): string {
    return `${this.commission}%`
  }

  @computed()
  public get roomsForUser(): string {
    return ROOM_TYPES[this.roomType]
  }

  @computed()
  public get houseTypeForUser(): string {
    return HOUSE_TYPES[this.houseType]
  }

  @computed()
  public get WCTypeForUser(): string {
    return WC_TYPES[this.WCType]
  }

  @computed()
  public get balconyTypeForUser(): string {
    return BALCONY_TYPES[this.balconyType]
  }

  @computed()
  public get layoutForUser(): string {
    return LAYOUT_TYPES[this.layoutType]
  }

  @computed()
  public get repairTypeForUser(): string {
    return REPAIR_TYPES[this.repairType]
  }

  @computed()
  public get houseBuildingTypeForUser(): string {
    return HOUSE_BUILDING_TYPES[this.houseBuildingType]
  }

  @computed()
  public get elevatorTypeForUser(): string {
    return ELEVATOR_TYPES[this.elevatorType]
  }

  @computed()
  public get rentalTypeForUser(): string {
    return this.rentalType ? RENTAL_TYPES[this.rentalType] : 'Не установлено'
  }

  @computed()
  public get communalPriceForUser(): string {
    return this.communalPrice?.toString() ?? 'Не установлено'
  }

  @computed()
  public get residentalComplexForUser(): string {
    return this.residentalComplex ?? 'Не установлено'
  }

  @computed()
  public get livingAreaForUser(): string {
    return this.livingArea?.toString() ?? 'Не установлено'
  }

  @computed()
  public get kitchenAreaForUser(): string {
    return this.kitchenArea?.toString() ?? 'Не установлено'
  }

  @computed()
  public get maxFloorForUser(): string {
    return this.maxFloor?.toString() ?? 'Не установлено'
  }

  @computed()
  public get yearOfConstructionForUser(): string {
    return this.yearOfConstruction?.toFormat('d MMMM, yyyy') ?? ''
  }

  @computed()
  public get ceilingHeightForUser(): string {
    return this.ceilingHeight?.toString() ?? 'Не установлено'
  }

  @computed()
  public get metroForUser(): string {
    return this.metro?.toString() ?? 'Не установлено'
  }

  @computed()
  public get createdAtForUser(): string {
    return this.createdAt.setLocale('ru-RU').toFormat('d MMMM, yyyy')
  }

  @computed()
  public get title(): string {
    let room: number | string
    let apartment: string = this.houseTypeForUser.toLowerCase()

    if (this.roomType == 0)
      room = 'Студия'
    else if (this.roomType == 6)
      room = '5+ - к'
    else
      room = `${this.roomType}-к`

    return `${room}, ${apartment} ${this.totalArea}`
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Estate)
  public estate: BelongsTo<typeof Estate>

  @beforeSave()
  public static createUuid(realEstate: RealEstate) {
    if (!realEstate.uuid)
      realEstate.uuid = uuid()
  }

  @beforeSave()
  public static setCommission(realEstate: RealEstate) {
    if (realEstate.commission > 100)
      realEstate.commission = 100
  }

  @beforeSave()
  public static setAddressToLowerCase(realEstate: RealEstate) {
    realEstate.address = realEstate.address.toLowerCase()
  }

  @hasMany(() => RealEstateImage)
  public images: HasMany<typeof RealEstateImage>

  public async imageUrl(): Promise<string> {
    return this.image ? await Drive.getUrl(this.image) : IMG_PLACEHOLDER
  }
}
