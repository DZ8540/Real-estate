import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersReports extends BaseSchema {
  protected tableName = 'usersReports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('from_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.integer('to_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.unique(['from_id', 'to_id'])

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
