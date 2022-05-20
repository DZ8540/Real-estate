import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RealEstates extends BaseSchema {
  protected tableName = 'realEstates'

  public async up () {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid')
      table.integer('transactionType').unsigned().notNullable().comment('Тип сделки. 0 - аренда, 1 - продажа')
      table.boolean('isCountersSeparately').defaultTo(1).notNullable()
      table.integer('pledge').unsigned().defaultTo(0).notNullable().comment('Залог, если равен 0, то отсутствует')
      table.integer('prepaymentType').unsigned().notNullable().comment(`
        Предоплата
        0 - 1 месяц
        1 - 2 месяца
        2 - 3 месяца
        ...
        11 - год
      `)
      table.integer('commission').unsigned().defaultTo(0).notNullable().comment('Комиссия, может быть значением от 0 до 100 процентов, но никак не выше')
      table.string('address', 1024).notNullable()
      table.integer('houseType').unsigned().notNullable().comment('Тип жилья. 0 - квартира, 1 - апартаменты')
      table.integer('roomType').unsigned().notNullable().comment(`
        Кол-во комнат.
        0 - студия
        1
        2
        3
        4
        5
        6 - 5+ (больше 5)
      `)
      table.integer('totalArea').unsigned().notNullable().comment('Общая площадь')
      table.integer('floor').unsigned().notNullable().comment('Этаж')
      table.integer('WCType').unsigned().notNullable().comment(`
        Тип санузла.
        0 - раздельный
        1 - Совмещенный
        2 - Два или более
      `)
      table.integer('balconyType').unsigned().notNullable().comment(`
        Тип балкона.
        0 - нет
        1 - балкон
        2 - лоджия
      `)
      table.integer('layoutType').unsigned().notNullable().comment(`
        Планировка.
        0 - изолированная
        1 - смежная
        2 - свободная
      `)
      table.integer('repairType').unsigned().notNullable().comment(`
        Тип ремонта.
        0 - Косметический
        1 - Евро
        2 - Дизайнерский
        3 - Без ремонта
      `)
      table.boolean('hasKitchenFurniture').defaultTo(0).notNullable().comment('Есть ли кухонная мебель. 0 - нету, 1 - есть')
      table.boolean('hasFurniture').defaultTo(0).notNullable().comment('Есть ли мебель. 0 - нету, 1 - есть')
      table.boolean('hasRefrigerator').defaultTo(0).notNullable().comment('Есть ли холодильник. 0 - нету, 1 - есть')
      table.boolean('hasWashingMachine').defaultTo(0).notNullable().comment('Есть ли стиральная машина. 0 - нету, 1 - есть')
      table.boolean('hasDishWasher').defaultTo(0).notNullable().comment('Есть ли посудомоечная машина. 0 - нету, 1 - есть')
      table.boolean('hasTv').defaultTo(0).notNullable().comment('Есть ли телевизор. 0 - нету, 1 - есть')
      table.boolean('hasConditioner').defaultTo(0).notNullable().comment('Есть ли кондиционер. 0 - нету, 1 - есть')
      table.boolean('hasInternet').defaultTo(0).notNullable().comment('Есть ли интернет. 0 - нету, 1 - есть')
      table.boolean('hasBathroom').defaultTo(0).notNullable().comment('Есть ли ванна. 0 - нету, 1 - есть')
      table.boolean('hasShowerCabin').defaultTo(0).notNullable().comment('Есть ли душевая кабина. 0 - нету, 1 - есть')
      table.boolean('withKids').defaultTo(0).notNullable().comment('Можно ли с детьми. 0 - можно, 1 - нет')
      table.boolean('withPets').defaultTo(0).notNullable().comment('Можно ли с животными. 0 - можно, 1 - нет')
      table.string('description', 4096).notNullable()
      table.integer('houseBuildingType').unsigned().notNullable().comment(`
        Тип постройки дома.
        0 - Кирпичный
        1 - Панельный
        2 - Монолитный
        3 - Блочный
        4 - Деревянный
      `)
      table.integer('elevatorType').unsigned().notNullable().comment(`
        Тип лифта.
        0 - Нет
        1 - Пассажирский
        2 - Грузовой
        3 - Пассажирский/Грузовой
      `)
      table.boolean('hasRamp').defaultTo(0).notNullable().comment('Есть ли пандус. 0 - нету, 1 - есть')
      table.boolean('hasGarbage').defaultTo(0).notNullable().comment('Есть ли мусоропровод. 0 - нету, 1 - есть')
      table.boolean('hasGroundParking').defaultTo(0).notNullable().comment('Есть ли наземная парковка')
      table.boolean('hasUnderGroundParking').defaultTo(0).notNullable().comment('Есть ли подземная парковка')
      table.boolean('hasMoreLayerParking').defaultTo(0).notNullable().comment('Есть ли многоуровневая парковка')
      table.integer('price').unsigned().notNullable()
      table.boolean('isMortgage').defaultTo(0).notNullable().comment('Есть ли ипотека')
      table.boolean('isEncumbrances').defaultTo(0).notNullable().comment('Есть ли обременения')
      table.integer('viewsCount').defaultTo(0).notNullable()
      table.boolean('isVip').defaultTo(0).notNullable()
      table.boolean('isHot').defaultTo(0).notNullable().comment('Срочная продажа или нет (статус hot)')
      table.boolean('isBanned').defaultTo(0).notNullable()
      table.string('image').nullable()
      table.integer('rentalType').unsigned().nullable().comment(`
        Если пустое, то сделка является продажей.
        0 - Длительно
        1 - Несколько месяцев
        2 - Посуточно
      `)
      table.integer('communalPrice').unsigned().nullable().comment('Включая коммунальные платежи. Если пустое, то сделка является продажей.')
      table.string('residentalComplex').nullable().comment('ЖК комплекс')
      table.integer('livingArea').nullable().comment('Жилая площадь в метрах в квадрате')
      table.integer('kitchenArea').nullable().comment('Площадь кухни')
      table.integer('maxFloor').nullable().comment('Максимальное кол-во этажей в доме. Не может быть меньше поля этажа квартиры')
      table.date('yearOfConstruction').nullable().comment('Дата постройки')
      table.decimal('ceilingHeight', 4, 1).nullable().comment('Высота потолков')
      table.string('metro').nullable()

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')

      table
        .integer('estate_id')
        .unsigned()
        .notNullable()
        .references('estates.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down () {
    this.schema.raw('DROP EXTENSION IF EXISTS "uuid-ossp"')

    this.schema.dropTable(this.tableName)
  }
}
