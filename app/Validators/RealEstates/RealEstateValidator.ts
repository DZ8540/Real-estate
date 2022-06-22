import BaseValidator from '../BaseValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  BalconyTypes, ElevatorTypes, HouseBuildingTypes,
  HouseTypes, LayoutTypes, PrepaymentTypes,
  RentalTypes, RepairTypes,
  RoomsTypes, TransactionTypes, WCTypes
} from 'Contracts/enums'

export default class RealEstateValidator extends BaseValidator {
  constructor(protected ctx: HttpContextContract) {
    super()
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    estateId: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'estates', column: 'id' }),
    ]),
    userId: schema.number([
      rules.unsigned(),
      rules.exists({ table: 'users', column: 'id' }),
    ]),
    transactionType: schema.number([
      rules.unsigned(),
      rules.range(0, TransactionTypes.SALE),
    ]),
    pledge: schema.number([
      rules.unsigned(),
    ]),
    commission: schema.number([
      rules.unsigned(),
      rules.range(0, 100),
    ]),
    address: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255),
    ]),
    district: schema.object().members({
      name: schema.string({ trim: true }, [
        rules.maxLength(255),
      ]),
      city: schema.string({ trim: true }, [
        rules.maxLength(255),
      ])
    }),
    latitude: schema.string({ trim: true }, [
      rules.maxLength(255)
    ]),
    longitude: schema.string({ trim: true }, [
      rules.maxLength(255)
    ]),
    houseType: schema.number([
      rules.unsigned(),
      rules.range(0, HouseTypes.COMMERCIAL_APARTMENT),
    ]),
    roomType: schema.number([
      rules.unsigned(),
      rules.range(0, RoomsTypes.MORE_FIVE_ROOMS),
    ]),
    totalArea: schema.number([
      rules.unsigned(),
    ]),
    floor: schema.number([
      rules.unsigned(),
    ]),
    WCType: schema.number([
      rules.unsigned(),
      rules.range(0, WCTypes.TWO_OR_MORE),
    ]),
    balconyType: schema.number([
      rules.unsigned(),
      rules.range(0, BalconyTypes.LOGGIE),
    ]),
    layoutType: schema.number([
      rules.unsigned(),
      rules.range(0, LayoutTypes.FREE),
    ]),
    repairType: schema.number([
      rules.unsigned(),
      rules.range(0, RepairTypes.NO_REPAIR),
    ]),
    isCountersSeparately: schema.boolean.optional(),
    hasKitchenFurniture: schema.boolean.optional(),
    hasFurniture: schema.boolean.optional(),
    hasRefrigerator: schema.boolean.optional(),
    hasWashingMachine: schema.boolean.optional(),
    hasDishWasher: schema.boolean.optional(),
    hasTv: schema.boolean.optional(),
    hasConditioner: schema.boolean.optional(),
    hasInternet: schema.boolean.optional(),
    hasBathroom: schema.boolean.optional(),
    hasShowerCabin: schema.boolean.optional(),
    withKids: schema.boolean.optional(),
    withPets: schema.boolean.optional(),
    hasRamp: schema.boolean.optional(),
    hasGarbage: schema.boolean.optional(),
    hasGroundParking: schema.boolean.optional(),
    hasUnderGroundParking: schema.boolean.optional(),
    hasMoreLayerParking: schema.boolean.optional(),
    isMortgage: schema.boolean.optional(),
    isEncumbrances: schema.boolean.optional(),
    description: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(4096),
    ]),
    houseBuildingType: schema.number([
      rules.unsigned(),
      rules.range(0, HouseBuildingTypes.WOOD),
    ]),
    elevatorType: schema.number([
      rules.unsigned(),
      rules.range(0, ElevatorTypes.PASSENGER_CARGO),
    ]),
    price: schema.number([
      rules.unsigned(),
    ]),
    isVip: schema.boolean.optional(),
    isHot: schema.boolean.optional(),
    prepaymentType: schema.number.optional([
      rules.unsigned(),
      rules.range(0, PrepaymentTypes.YEAR),
    ]),
    rentalType: schema.number.optional([
      rules.unsigned(),
      rules.range(0, RentalTypes.DAILY),
    ]),
    communalPrice: schema.number.optional([
      rules.unsigned(),
    ]),
    residentalComplex: schema.string.optional({ trim: true }, [
      rules.maxLength(255),
    ]),
    livingArea: schema.number.optional([
      rules.unsigned(),
    ]),
    kitchenArea: schema.number.optional([
      rules.unsigned(),
    ]),
    maxFloor: schema.number.optional([
      rules.unsigned(),
    ]),
    yearOfConstruction: schema.date.optional({ format: 'yyyy' }, [
      rules.before('today'),
    ]),
    ceilingHeight: schema.number.optional([
      rules.unsigned(),
      rules.range(3, 100),
    ]),
    image: schema.file.optional({
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    }),
    images: schema.array.optional().members(
      schema.file.optional({
        extnames: ['jpg', 'jpeg', 'png', 'webp'],
      })
    ),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    ...this.messages,
    'yearOfConstruction.before': 'Значение должно быть не выше сегодняшнего дня!'
  }
}
