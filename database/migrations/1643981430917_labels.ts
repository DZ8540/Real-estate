import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Labels extends BaseSchema {
  protected tableName = 'labels'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').unique().notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('createdAt', { useTz: true })
      table.timestamp('updatedAt', { useTz: true })

      table.comment('По дизайну это предоставляемые услуги, указываются при создании самих услуг')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
