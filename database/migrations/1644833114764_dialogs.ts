import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Dialogs extends BaseSchema {
  protected tableName = 'dialogs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('isFromDeleted').defaultTo(0).notNullable()
      table.boolean('isToDeleted').defaultTo(0).notNullable()

      table
        .integer('realEstate_id')
        .unsigned()
        .notNullable()
        .references('realEstates.id')
        .onDelete('CASCADE')

      table
        .integer('from_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('CASCADE')

      table
        .integer('to_id')
        .unsigned()
        .notNullable()
        .references('users.id')
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
