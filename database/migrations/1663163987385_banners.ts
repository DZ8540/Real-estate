import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Banners extends BaseSchema {
  protected tableName = 'banners'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {

      table.string('link').nullable()

    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {

      table.dropColumn('link')

    })
  }
}
