import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {

      table.string('companyName').nullable().comment('Только для юр лица')
      table.integer('taxIdentificationNumber').unsigned().unique().nullable().comment('Только для юр лица')

    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {

      table.dropColumns('companyName', 'taxIdentificationNumber')

    })
  }
}
