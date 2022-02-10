import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersReviewsReports extends BaseSchema {
  protected tableName = 'usersReviewsReports'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('usersReview_id').unsigned().notNullable().references('usersReviews.id').onDelete('CASCADE')
      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')
      table.unique(['usersReview_id', 'user_id'])

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
