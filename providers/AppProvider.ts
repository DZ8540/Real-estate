import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { APIPaginationConfig, PaginationConfig } from 'Contracts/database'

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

      return (await this.orderBy(orderByColumn, orderBy).paginate(page, limit)).baseUrl(baseURL)
    })

    ModelQueryBuilder.macro('getForAPI', async function({ page, limit, orderByColumn, orderBy }: APIPaginationConfig) {
      orderByColumn = orderByColumn ?? 'id'

      return (await this.orderBy(orderByColumn, orderBy).paginate(page, limit)).toJSON()
    })

    ModelQueryBuilder.macro('random', async function() {
      let allRecords = await this.orderBy('id', 'desc')
      let randomQuery: number = Math.floor(Math.random() * allRecords.length)

      return await this.where('id', allRecords[randomQuery].id).first()
    })
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
