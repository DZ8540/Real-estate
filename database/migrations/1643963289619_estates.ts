import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Estates extends BaseSchema {
  protected tableName = 'estates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').unique().notNullable()
      table.string('name').notNullable()

      table
        .integer('realEstateType_id')
        .unsigned()
        .nullable()
        .references('realEstateTypes.id')
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
