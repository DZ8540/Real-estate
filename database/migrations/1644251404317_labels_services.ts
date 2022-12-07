import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class LabelsServices extends BaseSchema {
  protected tableName = 'labels_services'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('service_id').unsigned().notNullable().references('services.id')
      table.integer('label_id').unsigned().notNullable().references('labels.id')
      table.unique(['service_id', 'label_id'])

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
