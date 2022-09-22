import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ResponsesImages extends BaseSchema {
  protected tableName = 'responsesImages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('image').notNullable()

      table
        .integer('response_id')
        .unsigned()
        .notNullable()
        .references('responses.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })

      table.comment('Фотки используются только для откликов на объявления (не на услуги)')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
