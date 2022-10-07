import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RealEstates extends BaseSchema {
  protected tableName = 'realEstates'

  public async up () {
    this.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uuid')
      table.integer('transactionType').unsigned().notNullable().comment(`
        Тип сделки
        0 - аренда
        1 - продажа
        2 - только в аренде
      `)
      table.integer('rentalPeriod').unsigned().notNullable().comment(`
        0 - посуточно
        1 - длительно
        2 - только в аренде
        3 - краткосрочно
      `)
      table.boolean('isCountersSeparately').defaultTo(1).notNullable()
      table.integer('pledge').unsigned().defaultTo(0).notNullable().comment('Залог, если равен 0, то отсутствует')
      table.integer('commission').unsigned().defaultTo(0).notNullable().comment('Комиссия, может быть значением от 0 до 100 процентов, но никак не выше')
      table.string('longitude').notNullable()
      table.string('latitude').notNullable()
      table.integer('roomType').unsigned().nullable().comment(`
        Кол-во комнат.
        0 - студия
        1
        2
        3
        4
        5
        6 - 5+ (больше 5)
        7 - свободная планировка
      `)
      table.integer('sellersType').unsigned().notNullable().comment(`
        1 - собственник
        2 - застройщики
        3 - агенства
        4 - неважно
      `)
      table.integer('saleType').unsigned().notNullable().comment(`
        1 - прямая
        2 - альтернативная
        3 - не важно
      `)
      table.integer('totalArea').unsigned().nullable().comment('Общая площадь')
      table.integer('floor').unsigned().nullable().comment('Этаж')
      table.integer('WCType').unsigned().nullable().comment(`
        Тип санузла.
        0 - раздельный
        1 - Совмещенный
        2 - Два или более
      `)
      table.integer('balconyType').unsigned().nullable().comment(`
        Тип балкона.
        0 - нет
        1 - балкон
        2 - лоджия
        3 - несколько
      `)
      table.integer('layoutType').unsigned().nullable().comment(`
        Планировка.
        0 - изолированная
        1 - смежная
        2 - свободная
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
      table.boolean('hasBasement').defaultTo(0).notNullable().comment('Есть ли подвал. 0 - нету, 1 - есть')
      table.boolean('withKids').defaultTo(0).notNullable().comment('Можно ли с детьми. 0 - можно, 1 - нет')
      table.boolean('withPets').defaultTo(0).notNullable().comment('Можно ли с животными. 0 - можно, 1 - нет')
      table.string('description', 4096).notNullable()
      table.integer('houseBuildingType').unsigned().nullable().comment(`
        Тип постройки дома.
        0 - Кирпичный
        1 - Панельный
        2 - Монолитный
        3 - Блочный
        4 - Деревянный
        5 - Кирпично-монолитный
        6 - Керамзитный
        7 - Газоблок
        8 - Пеноблок
        9 - Армалитовые блоки
        10 - Сип-панели
        11 - Смешанные
      `)
      table.integer('elevatorType').unsigned().nullable().comment(`
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
      table.boolean('hasYardParking').defaultTo(0).notNullable().comment('Есть ли дворовая парковка')
      table.boolean('hasBarrierParking').defaultTo(0).notNullable().comment('Есть ли парковка с шлагбаумом')
      table.boolean('hasVentilation').defaultTo(0).notNullable()
      table.boolean('hasFireAlarm').defaultTo(0).notNullable()
      table.boolean('hasSecurityAlarm').defaultTo(0).notNullable()
      table.boolean('hasSecurity').defaultTo(0).notNullable()
      table.integer('price').unsigned().notNullable()
      table.boolean('isMortgage').defaultTo(0).notNullable().comment('Есть ли ипотека')
      table.boolean('isEncumbrances').defaultTo(0).notNullable().comment('Есть ли обременения')
      table.integer('viewsCount').defaultTo(0).notNullable()
      table.boolean('isVip').defaultTo(0).notNullable()
      table.boolean('isHot').defaultTo(0).notNullable().comment('Срочная продажа или нет (статус hot)')
      table.boolean('isBanned').defaultTo(0).notNullable()
      table.integer('estateType').unsigned().nullable().comment(`
        Присылает фронт в зависимости от выбранного estate_id (лапшекод, такое решение было принято в пользу быстрой сдачи проекта)
        Есть только у жилых объектов (realEstatesTypes жилая)
        0 - новостройка
        1 - вторичка
      `)
      table.integer('repairType').unsigned().nullable().comment(`
        Тип ремонта.
        0 - Косметический
        1 - Евро
        2 - Дизайнерский
        3 - Без ремонта
      `)
      table.integer('windRoseDirectionType').unsigned().nullable().comment(`
        Тип направления по розе ветров
        0 - север
        1 - юг
        2 - запад
        3 - восток
        4 - северо-восток
        5 - юго-восток
        6 - северо-запад
        7 - юго-запад
      `)
      table.integer('directionType').unsigned().nullable().comment(`
        0 - Административная деятельность
        1 - Гостиничный бизнес и общественное питание
        2 - Информация и связь
        3 - Обрабатывающие производства
        4 - Строительство
        5 - Водоотведение, водоснабжение, утилизация и сбор отходов, ликвидация различного рода загрязнений
        6 - Домашние хозяйства
        7 - Лесное и сельское хозяйство, рыбоводство, рыболовство, охота
        8 - Образование
        9 - Торговля (опт и розница), а также ремонт автомобилей и мотоциклов
        10 - Военная безопасность, соцобеспечение, госуправление
        11 - Другие услуги
        12 - Научная, техническая, профессиональная деятельность
        13 - Операции с недвижимостью
        14 - Финансы и страхование
        15 - Все, что связано с добычей полезных ископаемых
        16 - Здравоохранение
        17 - Обеспечение газом, паром, энергией, кондиционирование
        18 - Спорт, культура, досуг, развлечения
        19 - Хранение и транспортировка
      `)
      table.integer('outBuildingType').unsigned().nullable().comment(`
        Тип хозпостроек
        0 - гараж
        1 - баня
        2 - хозпостройки
      `)
      table.integer('landArea').unsigned().nullable().comment('Есть только у жилого типа объекта')
      table.integer('areaType').unsigned().nullable().comment(`
        Есть только у жилых объектов
        0 - СНТ
        1 - ИЖС
        2 - ЛПХ
      `)
      table.string('address', 1024).notNullable()
      table.integer('houseType').unsigned().nullable().comment(`
        Тип жилья
        0 - квартира
        1 - апартаменты
      `)
      table.integer('window').unsigned().nullable().comment(`
        Есть только у жилых объектов
        0 - во двор
        1 - на улицу
        2 - на солнечную сторону
        3 - на две стороны
      `)
      table.integer('windowType').unsigned().nullable().comment(`
        Есть только у жилых объектов
        0 - обычное прямоугольное
        1 - с вращающейся рамой
        2 - в нише
        3 - панорамное
        4 - французское
        5 - эркер
        6 - с изогнутым верхом
        7 - выгнутое
        8 - со скользящей рамой
        9 - со створным переплетом
      `)
      table.integer('gradeType').unsigned().nullable().comment(`
        Есть только у коммерческих объектов
        0 - A
        1 - A+
        2 - B
        3 - B+
        4 - C
        5 - D
      `)
      table.integer('buildingType').unsigned().nullable().comment(`
        Есть только у коммерческих объектов
        0 - бизнес-центр
        1 - торговый центр
        2 - административное здание
        3 - жилой дом
        4 - другое
      `)
      table.integer('locationType').unsigned().nullable().comment(`
        Есть только у гаражных объектов
        0 - отдельный
        1 - кооперативный
      `)
      table.string('image').nullable()
      table.integer('prepaymentType').unsigned().nullable().comment(`
        Предоплата
        0 - нет
        1 - 1 месяц
        2 - 2 месяца
        3 - 3 месяца
        ...
        12 - год
      `)
      table.integer('rentalType').unsigned().nullable().comment(`
        Если пустое, то сделка является продажей.
        0 - Длительно
        1 - Несколько месяцев
        2 - Посуточно
      `)
      table.integer('communalPrice').unsigned().nullable().comment('Включая коммунальные платежи. Если пустое, то сделка является продажей.')
      table.string('residentalComplex').nullable().comment('ЖК комплекс')
      table.integer('livingArea').unsigned().nullable().comment('Жилая площадь в метрах в квадрате')
      table.integer('kitchenArea').unsigned().nullable().comment('Площадь кухни')
      table.integer('acres').unsigned().nullable().comment('Площадь соток, есть только у земельных участков')
      table.integer('cityDistance').unsigned().nullable().comment('Расстояние до города, есть только у земельных участков')
      table.integer('maxFloor').unsigned().nullable().comment('Максимальное кол-во этажей в доме. Не может быть меньше поля этажа квартиры')
      table.date('yearOfConstruction').nullable().comment('Дата постройки')
      table.decimal('ceilingHeight', 4, 1).nullable().comment('Высота потолков')

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

      table
        .integer('district_id')
        .unsigned()
        .notNullable()
        .references('districts.id')
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
