import { PaginationConfig } from 'Contracts/database'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {}

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready

    const {
      ModelQueryBuilder
    } = this.app.container.use('Adonis/Lucid/Database')

    ModelQueryBuilder.macro('get', async function({ page, limit, orderByColumn, orderBy, baseURL }: PaginationConfig) {
      orderByColumn = orderByColumn ?? 'id'
      let query = await this.orderBy(orderByColumn, orderBy).paginate(page, limit)

      if (baseURL)
        return query.baseUrl(baseURL)

      return query
    })

    ModelQueryBuilder.macro('random', async function() {
      let allRecords = await this.orderBy('id', 'desc')
      let randomQuery: number = Math.floor(Math.random() * allRecords.length)

      return await this.where('id', allRecords[randomQuery].id).first()
    })
  }

  public async ready () {
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
