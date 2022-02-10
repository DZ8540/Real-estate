import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RealEstatesReports extends BaseSchema {
  protected tableName = 'realEstatesReports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('realEstate_id').unsigned().notNullable().references('realEstates.id').onDelete('CASCADE')
      table.unique(['user_id', 'realEstate_id'])

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
