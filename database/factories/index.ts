import News from 'App/Models/News'
import User from 'App/Models/Users/User'
import Question from 'App/Models/Question'
import District from 'App/Models/District'
import Label from 'App/Models/Services/Label'
import Factory from '@ioc:Adonis/Lucid/Factory'
import Service from 'App/Models/Services/Service'
import Estate from 'App/Models/RealEstates/Estate'
import Response from 'App/Models/Response/Response'
import UsersReview from 'App/Models/Users/UsersReview'
import RoleService from 'App/Services/Users/RoleService'
import RealEstate from 'App/Models/RealEstates/RealEstate'
import ServicesType from 'App/Models/Services/ServicesType'
import RealEstateType from 'App/Models/RealEstates/RealEstateType'
import { OwnerTypes, Roles } from 'Config/users'
import { ResponsesStatusTypes } from 'Contracts/response'
import {
  BalconyTypes, ElevatorTypes, HouseBuildingTypes, HouseTypes,
  LayoutTypes, PrepaymentTypes, RepairTypes, RoomsTypes,
  WCTypes, TransactionTypes, RentalPeriodTypes, SellersTypes, SaleTypes,
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
        companyName: faker.company.companyName(),
        taxIdentificationNumber: faker.unique(faker.datatype.number),
      }
    })
  })
  .relation('realEstatesWishList', () => RealEstateFactory)
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

export const DistrictFactory = Factory
  .define(District, async ({ faker }) => {
    return {
      name: faker.address.direction(),
      city: faker.address.cityName(),
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
      // experienceType: faker.datatype.number(3),
      description: faker.lorem.paragraphs(3),
      userId: (await User.query().random()).id,
      servicesTypesSubServiceId: (await ServicesType.query().random()).id,
    }
  })
  .relation('labels', () => LabelFactory)
  .relation('responses', () => ResponseFactory)
  .build()

export const RealEstateFactory = Factory
  .define(RealEstate, async ({ faker }) => {
    return {
      transactionType: faker.datatype.number(TransactionTypes.ONLY_RENT),
      prepaymentType: faker.datatype.number(PrepaymentTypes.YEAR),
      address: faker.address.cardinalDirection(),
      district: faker.address.direction(),
      longitude: faker.address.longitude(),
      latitude: faker.address.latitude(),
      houseType: faker.datatype.number(HouseTypes.COMMERCIAL_APARTMENT),
      roomType: faker.datatype.number(RoomsTypes.FREE),
      totalArea: faker.datatype.number(200),
      floor: faker.datatype.number(20),
      WCType: faker.datatype.number(WCTypes.TWO_OR_MORE),
      balconyType: faker.datatype.number(BalconyTypes.SEVERAL),
      layoutType: faker.datatype.number(LayoutTypes.ISOLATED_ADJACENT),
      repairType: faker.datatype.number(RepairTypes.NO_REPAIR),
      description: faker.lorem.text(),
      houseBuildingType: faker.datatype.number(HouseBuildingTypes.MIXED),
      elevatorType: faker.datatype.number(ElevatorTypes.PASSENGER_CARGO),
      price: faker.datatype.number(1_000_000),
      isVip: faker.datatype.boolean(),
      isHot: faker.datatype.boolean(),
      userId: (await User.query().random()).id,
      estateId: (await Estate.query().random()).id,
      districtId: (await District.query().random()).id,
      rentalPeriod: faker.datatype.number(RentalPeriodTypes.SHORT_TIME),
      sellerType: faker.datatype.number(SellersTypes.NOT_IMPORTANT),
      saleType: faker.datatype.number(SaleTypes.NOT_IMPORTANT),
    }
  })
  .build()

  export const UsersReviewsFactory = Factory
  .define(UsersReview, async ({ faker }) => {
    return {
      rating: faker.datatype.number(5),
      description: faker.lorem.paragraphs(3),
      fromId: (await User.query().random()).id,
      toId: (await User.query().random()).id,
    }
  })
  .build()

export const QuestionsFactory = Factory
  .define(Question, ({ faker }) => {
    return {
      name: faker.vehicle.vehicle(),
      email: faker.internet.email(),
      question: faker.lorem.paragraphs(3),
    }
  })
  .build()

export const ResponseFactory = Factory
  .define(Response, ({ faker }) => {
    return {
      description: faker.lorem.paragraphs(2),
      status: faker.datatype.number({
        min: ResponsesStatusTypes.UNDER_CONSIDERATION,
        max: ResponsesStatusTypes.COMPLETED,
      }),
      userId: faker.datatype.number({ min: 1, max: 20 }),
    }
  })
  .build()
