import Estate from './Estate'
import User from '../Users/User'
import District from '../District'
import Drive from '@ioc:Adonis/Core/Drive'
import RealEstateImage from './RealEstateImage'
import Database from '@ioc:Adonis/Lucid/Database'
import CamelCaseNamingStrategy from '../../../start/CamelCaseNamingStrategy'
import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { IMG_PLACEHOLDER } from 'Config/drive'
import {
  BaseModel, beforeFetch, beforeFind,
  beforeSave, BelongsTo, belongsTo,
  column, computed, ExtractModelRelations, HasMany,
  hasMany, ManyToMany, manyToMany, ModelObject, ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm'
import {
  AREA_TYPES, BALCONY_TYPES, BUILDING_TYPES,
  DIRECTION_TYPES, ELEVATOR_TYPES, ESTATE_TYPES,
  GRADE_TYPES, HOUSE_BUILDING_TYPES, HOUSE_TYPES,
  LAYOUT_TYPES, LOCATION_TYPES, PREPAYMENT_TYPES,
  RENTAL_PERIODS_TYPES, RENTAL_TYPES, REPAIR_TYPES, ROOM_TYPES,
  TRANSACTION_TYPES, WC_TYPES, WINDOW, WINDOW_TYPES,
  WIND_ROSE_DIRECTION_TYPES, SALE_TYPES, SELLERS_TYPES, OUT_BUILDING_TYPES,
} from 'Config/realEstatesTypes'

export default class RealEstate extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy()
  public static readonly columns = [
    'id', 'uuid', 'transactionType', 'isCountersSeparately',
    'pledge', 'prepaymentType', 'commission',
    'address', 'longitude', 'ceilingHeight', 'cadastralNumber',
    'latitude', 'houseType', 'roomType',
    'totalArea', 'floor', 'WCType',
    'balconyType', 'layoutType', 'repairType',
    'hasKitchenFurniture', 'hasFurniture', 'hasRefrigerator',
    'hasWashingMachine', 'hasDishWasher', 'hasTv',
    'hasConditioner', 'hasInternet', 'hasBathroom',
    'hasShowerCabin', 'withKids', 'withPets',
    'description', 'estateType', 'image', 'houseBuildingType',
    'elevatorType', 'hasRamp', 'hasGarbage',
    'hasGroundParking', 'hasUnderGroundParking', 'hasMoreLayerParking',
    'price', 'isMortgage', 'isEncumbrances',
    'viewsCount', 'isVip', 'isHot', 'isBanned',
    'rentalType', 'communalPrice', 'residentalComplex',
    'livingArea', 'kitchenArea', 'maxFloor',
    'yearOfConstruction', 'userId', 'estateId',
    'sellerType', 'saleType',
    'districtId', 'createdAt', 'updatedAt'
  ] as const

  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public transactionType: number

  @column()
  public rentalPeriod: number

  @column()
  public isCountersSeparately: boolean

  @column()
  public pledge: number

  @column()
  public commission: number

  @column()
  public longitude: string

  @column()
  public latitude: string

  @column()
  public roomType: number | undefined

  @column()
  public totalArea: number | undefined

  @column()
  public floor: number | undefined

  @column({ columnName: 'WCType' })
  public WCType: number | undefined

  @column()
  public balconyType: number | undefined

  @column()
  public layoutType: number | undefined

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
  public hasTv: boolean

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
  public houseBuildingType: number | undefined

  @column()
  public elevatorType: number | undefined

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
  public hasYardParking: boolean

  @column()
  public hasBarrierParking: boolean

  @column()
  public hasBasement: boolean

  @column()
  public hasVentilation: boolean

  @column()
  public hasFireAlarm: boolean

  @column()
  public hasSecurityAlarm: boolean

  @column()
  public hasSecurity: boolean

  @column()
  public price: number

  @column()
  public isMortgage: boolean

  @column()
  public isEncumbrances: boolean

  @column()
  public viewsCount: number

  @column()
  public sellerType: number

  @column()
  public saleType: number

  @column()
  public isVip: boolean

  @column()
  public isHot: boolean

  @column()
  public isBanned: boolean

  @column()
  public estateType: number | undefined

  @column()
  public landArea: number | undefined

  @column()
  public areaType: number | undefined

  @column()
  public address: string

  @column()
  public houseType: number | undefined

  @column()
  public window: number | undefined

  @column()
  public windowType: number | undefined

  @column()
  public repairType: number | undefined

  @column()
  public outBuildingType: number | undefined

  @column()
  public windRoseDirectionType: number | undefined

  @column()
  public directionType: number | undefined

  @column()
  public gradeType: number | undefined

  @column()
  public buildingType: number | undefined

  @column()
  public locationType: number | undefined

  @column()
  public cadastralNumber: string | undefined

  @column()
  public image: string | undefined

  @column()
  public prepaymentType: number | undefined

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

  @column()
  public acres: number | undefined

  @column()
  public cityDistance: number | undefined

  @column.date()
  public yearOfConstruction: DateTime | undefined

  @column()
  public ceilingHeight: number | undefined

  @column({ columnName: 'user_id' })
  public userId: User['id']

  @column({ columnName: 'estate_id' })
  public estateId: Estate['id']

  @column({ columnName: 'district_id' })
  public districtId: District['id']

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
    if (this.prepaymentType !== undefined && this.prepaymentType !== null)
      return PREPAYMENT_TYPES[this.prepaymentType]

    return 'Нету'
  }

  @computed()
  public get commissionForUser(): string {
    return `${this.commission}%`
  }

  @computed()
  public get roomsForUser(): string {
    if (this.roomType !== undefined && this.roomType !== null)
      return ROOM_TYPES[this.roomType]

    return ''
  }

  @computed()
  public get outBuildingTypeForUser(): string {
    if (this.outBuildingType !== undefined && this.outBuildingType !== null)
      return OUT_BUILDING_TYPES[this.outBuildingType]

    return ''
  }

  @computed()
  public get houseTypeForUser(): string {
    if (this.houseType !== undefined && this.houseType !== null)
      return HOUSE_TYPES[this.houseType]

    return ''
  }

  @computed()
  public get WCTypeForUser(): string {
    if (this.WCType !== undefined && this.WCType !== null)
      return WC_TYPES[this.WCType]

    return ''
  }

  @computed()
  public get balconyTypeForUser(): string {
    if (this.balconyType !== undefined && this.balconyType !== null)
      return BALCONY_TYPES[this.balconyType]

    return ''
  }

  @computed()
  public get layoutForUser(): string {
    if (this.layoutType !== undefined && this.layoutType !== null)
      return LAYOUT_TYPES[this.layoutType]

    return ''
  }

  @computed()
  public get repairTypeForUser(): string {
    if (this.repairType !== undefined && this.repairType !== null)
      return REPAIR_TYPES[this.repairType]

    return ''
  }

  @computed()
  public get houseBuildingTypeForUser(): string {
    if (this.houseBuildingType !== undefined && this.houseBuildingType !== null)
      return HOUSE_BUILDING_TYPES[this.houseBuildingType]

    return ''
  }

  @computed()
  public get elevatorTypeForUser(): string {
    if (this.elevatorType !== undefined && this.elevatorType !== null)
      return ELEVATOR_TYPES[this.elevatorType]

    return ''
  }

  @computed()
  public get rentalTypeForUser(): string {
    if (this.rentalType !== undefined && this.rentalType !== null)
      return RENTAL_TYPES[this.rentalType]

    return 'Не установлено'
  }

  @computed()
  public get estateTypeForUser(): string {
    if (this.estateType !== undefined && this.estateType !== null)
      return ESTATE_TYPES[this.estateType]

    return 'Не установлено'
  }

  @computed()
  public get areaTypeForUser(): string {
    if (this.areaType !== undefined && this.areaType !== null)
      return AREA_TYPES[this.areaType]

    return 'Не установлено'
  }

  @computed()
  public get rentalPeriodTypeForUser(): string {
    if (this.rentalPeriod !== undefined && this.rentalPeriod !== null)
      return RENTAL_PERIODS_TYPES[this.rentalPeriod]

    return 'Не установлено'
  }

  @computed()
  public get windowForUser(): string {
    if (this.window !== undefined && this.window !== null)
      return WINDOW[this.window]

    return 'Не установлено'
  }

  @computed()
  public get windowTypeForUser(): string {
    if (this.windowType !== undefined && this.windowType !== null)
      return WINDOW_TYPES[this.windowType]

    return 'Не установлено'
  }

  @computed()
  public get windRoseDirectionTypeForUser(): string {
    if (this.windRoseDirectionType !== undefined && this.windRoseDirectionType !== null)
      return WIND_ROSE_DIRECTION_TYPES[this.windRoseDirectionType]

    return 'Не установлено'
  }

  @computed()
  public get directionTypeForUser(): string {
    if (this.directionType !== undefined && this.directionType !== null)
      return DIRECTION_TYPES[this.directionType]

    return 'Не установлено'
  }

  @computed()
  public get gradeTypeForUser(): string {
    if (this.gradeType !== undefined && this.gradeType !== null)
      return GRADE_TYPES[this.gradeType]

    return 'Не установлено'
  }

  @computed()
  public get buildingTypeForUser(): string {
    if (this.buildingType !== undefined && this.buildingType !== null)
      return BUILDING_TYPES[this.buildingType]

    return 'Не установлено'
  }

  @computed()
  public get locationTypeForUser(): string {
    if (this.locationType !== undefined && this.locationType !== null)
      return LOCATION_TYPES[this.locationType]

    return 'Не установлено'
  }

  @computed()
  public get sellerTypeForUser(): string {
    return SELLERS_TYPES[this.sellerType]
  }

  @computed()
  public get saleTypeForUser(): string {
    return SALE_TYPES[this.saleType]
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
    return this.yearOfConstruction?.toFormat('yyyy') ?? ''
  }

  @computed()
  public get ceilingHeightForUser(): string {
    return this.ceilingHeight?.toString() ?? 'Не установлено'
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
    else if (this.roomType == 7)
      room = 'Свободная планировка'
    else
      room = `${this.roomType}-к`

    return `${room}, ${apartment} ${this.totalArea}`
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Estate)
  public estate: BelongsTo<typeof Estate>

  @belongsTo(() => District)
  public district: BelongsTo<typeof District>

  @hasMany(() => RealEstateImage)
  public images: HasMany<typeof RealEstateImage>

  @manyToMany(() => User, { pivotTable: 'realEstatesViews' })
  public realEstatesViews: ManyToMany<typeof User>

  @beforeSave()
  public static createUuid(realEstate: RealEstate) {
    if (!realEstate.uuid)
      realEstate.uuid = uuid()
  }

  @beforeSave()
  public static setCommissionAndAddress(realEstate: RealEstate) {
    if (realEstate.commission > 100)
      realEstate.commission = 100

    if (realEstate.address)
      realEstate.address = realEstate.address.toLowerCase()
  }

  @beforeFind()
  @beforeFetch()
  public static async preloadRelations(query: ModelQueryBuilderContract<typeof RealEstate>) {
    query
      .preload('user')
      .preload('images')
      .preload('district')
  }

  public async imageUrl(): Promise<string> {
    return this.image ? await Drive.getUrl(this.image) : IMG_PLACEHOLDER
  }

  public async getForUser(currentUserId: User['id']): Promise<ModelObject> {
    const item: ModelObject = { ...this.serialize() }

    try { // @ts-ignore
      await this.related('realEstatesViews' as ExtractModelRelations<RealEstate>).attach([ currentUserId ])
    } catch (err: any) {}

    const isInWishlist = await Database
      .from('realEstatesWishlists')
      .where('user_id', currentUserId)
      .andWhere('realEstate_id', item.id)
      .first()

    const isInReports = await Database
      .from('realEstatesReports')
      .where('user_id', currentUserId)
      .andWhere('realEstate_id', item.id)
      .first()

    const isViewed = await Database
      .from('realEstatesViews')
      .where('user_id', currentUserId)
      .andWhere('realEstate_id', item.id)
      .first()

    item.wishlistStatus = isInWishlist ? true : false
    item.reportStatus = isInReports ? true : false
    item.isViewed = isViewed ? true : false

    return item
  }
}
