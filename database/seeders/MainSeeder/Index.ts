import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder(seeder: { default: typeof BaseSeeder }) {
    /**
     * Do not run when not in dev mode and seeder is development
     * only
     */
    if (seeder.default.developmentOnly && !Application.inDev) {
      return
    }

    await new seeder.default(this.client).run()
  }

  public async run () {
    await this.runSeeder(await import('../Users/Role'))
    await this.runSeeder(await import('../News'))
    await this.runSeeder(await import('../RealEstates/RealEstateType'))
    await this.runSeeder(await import('../RealEstates/Estate'))
    // await this.runSeeder(await import('../Label'))
    await this.runSeeder(await import('../Services/ServicesType'))
    await this.runSeeder(await import('../District'))
    await this.runSeeder(await import('../Users/User'))
    await this.runSeeder(await import('../Services/Service'))
    await this.runSeeder(await import('../Users/UsersReview'))
    await this.runSeeder(await import('../Question'))
    // await this.runSeeder(await import('../RealEstates/RealEstate'))
  }
}
