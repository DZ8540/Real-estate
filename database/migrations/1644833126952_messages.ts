import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('text', 4096).notNullable()
      table.boolean('isRead').defaultTo(0).notNullable()
      table.boolean('isFromDeleted').defaultTo(0).notNullable()
      table.boolean('isToDeleted').defaultTo(0).notNullable()
      table.boolean('isFromMessage').notNullable()

      table
        .integer('dialog_id')
        .unsigned()
        .references('dialogs.id')
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
