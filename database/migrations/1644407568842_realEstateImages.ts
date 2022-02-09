import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RealEstateImages extends BaseSchema {
  protected tableName = 'realEstateImages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('image').notNullable()

      table
        .integer('realEstate_id')
        .unsigned()
        .notNullable()
        .references('realEstates.id')
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
