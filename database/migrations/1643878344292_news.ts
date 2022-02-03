import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class News extends BaseSchema {
  protected tableName = 'news'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug').unique().notNullable()
      table.string('title').notNullable()
      table.string('description', 8192).notNullable()
      table.integer('readingTime').unsigned().defaultTo(1).notNullable().comment('Значения в минутах, минимум 1 минута')
      table.string('image').nullable()

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
