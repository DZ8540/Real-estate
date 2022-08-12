import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Services extends BaseSchema {
  protected tableName = 'services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('experienceType').unsigned().notNullable().comment(`
        Опыт работы
        0 - до 1 года
        1 - до 3 лет
        2 - до 6 лет
        3 - до 10 лет
      `)
      table.string('description', 1024).notNullable()
      table.boolean('isBanned').defaultTo(0).notNullable().comment('0 - нет, 1 - да')

      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')

      table
        .integer('servicesTypesSubService_id')
        .unsigned()
        .notNullable()
        .references('servicesTypesSubServices.id')
        .onDelete('CASCADE')

      table
        .integer('servicesTypesAttribute_id')
        .unsigned()
        .nullable()
        .references('servicesTypesAttributes.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
