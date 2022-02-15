import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MessagesImages extends BaseSchema {
  protected tableName = 'messagesImages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('image').notNullable()

      table
        .integer('message_id')
        .unsigned()
        .references('messages.id')
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
