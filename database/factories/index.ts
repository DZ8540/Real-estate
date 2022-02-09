import User from 'App/Models/User'
import News from 'App/Models/News'
import Label from 'App/Models/Label'
import Estate from 'App/Models/Estate'
import Service from 'App/Models/Service'
import RealEstate from 'App/Models/RealEstate'
import Factory from '@ioc:Adonis/Lucid/Factory'
import RoleService from 'App/Services/RoleService'
import ServicesType from 'App/Models/ServicesType'
import RealEstateType from 'App/Models/RealEstateType'
import {
  BalconyTypes, ElevatorTypes, HouseBuildingTypes,
  HouseTypes, LayoutTypes, OwnerTypes,
  PrepaymentTypes, RealEstatesStatusTypes,
  RepairTypes, Roles, RoomsTypes,
  TransactionTypes, WCTypes
} from 'Contracts/enums'

export const UserFactory = Factory
  .define(User, ({ faker }) => {
    return RoleService.get(Roles.USER).then(item => {
      return {
        ownerType: faker.datatype.number(OwnerTypes.AGENT),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: '1234Test',
        roleId: item.id,
      }
    })
  })
  .build()

export const NewsFactory = Factory
  .define(News, ({ faker }) => {
    return {
      title: faker.vehicle.vehicle(),
      description: faker.lorem.paragraphs(10),
      readingTime: faker.datatype.number(),
    }
  })
  .build()

export const EstateFactory = Factory
  .define(Estate, async ({ faker }) => {
    return {
      name: faker.lorem.word(),
      realEstateTypeId: (await RealEstateType.query().random()).id,
    }
  })
  .build()

export const LabelFactory = Factory
  .define(Label, async ({ faker }) => {
    return { name: faker.lorem.words(2) }
  })
  .build()

export const ServicesFactory = Factory
  .define(Service, async ({ faker }) => {
    return {
      experienceType: faker.datatype.number(3),
      description: faker.lorem.paragraphs(3),
      userId: (await User.query().random()).id,
      servicesTypeId: (await ServicesType.query().random()).id,
    }
  })
  .relation('labels', () => LabelFactory)
  .build()

export const RealEstateFactory = Factory
  .define(RealEstate, async ({ faker }) => {
    return {
      transactionType: faker.datatype.number(TransactionTypes.SALE),
      prepaymentType: faker.datatype.number(PrepaymentTypes.YEAR),
      address: faker.address.cardinalDirection(),
      houseType: faker.datatype.number(HouseTypes.COMMERCIAL_APARTMENT),
      roomType: faker.datatype.number(RoomsTypes.MORE_FIVE_ROOMS),
      totalArea: faker.datatype.number(200),
      floor: faker.datatype.number(20),
      WCType: faker.datatype.number(WCTypes.TWO_OR_MORE),
      balconyType: faker.datatype.number(BalconyTypes.LOGGIE),
      layoutType: faker.datatype.number(LayoutTypes.FREE),
      repairType: faker.datatype.number(RepairTypes.NO_REPAIR),
      description: faker.lorem.text(),
      houseBuildingType: faker.datatype.number(HouseBuildingTypes.WOOD),
      elevatorType: faker.datatype.number(ElevatorTypes.PASSENGER_CARGO),
      price: faker.datatype.number(1_000_000),
      statusType: faker.datatype.number(RealEstatesStatusTypes.VIP),
      userId: (await User.query().random()).id,
      estateId: (await Estate.query().random()).id,
    }
  })
  .build()
