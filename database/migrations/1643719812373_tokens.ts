import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tokens extends BaseSchema {
  protected tableName = 'tokens'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('token', 1024).notNullable()
      table.string('fingerprint').notNullable()
      table.string('ua').notNullable().comment('User agent')
      table.string('ip').notNullable()

      table
        .integer('user_id')
        .unsigned()
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
