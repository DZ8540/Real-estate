import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
  BalconyTypes, ElevatorTypes, HouseBuildingTypes,
  LayoutTypes, RentalTypes, RepairTypes,
  RoomsTypes, TransactionTypes, WCTypes
} from 'Contracts/enums'
import BaseValidator from 'App/Validators/BaseValidator'

export default class RealEstateGetForMapValidator extends BaseValidator {
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
    estateId: schema.number.optional([
      rules.unsigned(),
      rules.exists({ table: 'estates', column: 'id' }),
    ]),
    transactionType: schema.number.optional([
      rules.unsigned(),
      rules.range(0, TransactionTypes.SALE),
    ]),
    districts: schema.array.optional().members(schema.number([
      rules.unsigned(),
    ])),
    addressOrResidentalComplex: schema.string.optional({}, [
      rules.maxLength(255),
    ]),
    roomTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, RoomsTypes.MORE_FIVE_ROOMS),
    ])),
    startPrice: schema.number.optional([
      rules.unsigned(),
    ]),
    endPrice: schema.number.optional([
      rules.unsigned(),
    ]),
    rentalTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, RentalTypes.DAILY),
    ])),
    repairTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, RepairTypes.NO_REPAIR),
    ])),
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
    isCountersSeparately: schema.boolean.optional(),
    isMortgage: schema.boolean.optional(),
    isEncumbrances: schema.boolean.optional(),
    startTotalArea: schema.number.optional([
      rules.unsigned(),
    ]),
    endTotalArea: schema.number.optional([
      rules.unsigned(),
    ]),
    startLivingArea: schema.number.optional([
      rules.unsigned(),
    ]),
    endLivingArea: schema.number.optional([
      rules.unsigned(),
    ]),
    startKitchenArea: schema.number.optional([
      rules.unsigned(),
    ]),
    endKitchenArea: schema.number.optional([
      rules.unsigned(),
    ]),
    layoutTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, LayoutTypes.FREE),
    ])),
    WCTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, WCTypes.TWO_OR_MORE),
    ])),
    startFloor: schema.number.optional([
      rules.unsigned(),
    ]),
    endFloor: schema.number.optional([
      rules.unsigned(),
    ]),
    startMaxFloor: schema.number.optional([
      rules.unsigned(),
    ]),
    endMaxFloor: schema.number.optional([
      rules.unsigned(),
    ]),
    balconyTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, BalconyTypes.LOGGIE),
    ])),
    houseBuildingTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, HouseBuildingTypes.WOOD),
    ])),
    yearOfConstruction: schema.date.optional({ format: 'yyyy' }),
    elevatorTypes: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.range(0, ElevatorTypes.PASSENGER_CARGO),
    ])),
    ceilingHeight: schema.number.optional([
      rules.unsigned(),
      rules.range(3, 100),
    ]),
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
