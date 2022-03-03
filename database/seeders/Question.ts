import Logger from '@ioc:Adonis/Core/Logger'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { QuestionsFactory } from 'Database/factories'

export default class QuestionSeeder extends BaseSeeder {
  public async run () {
    try {
      await QuestionsFactory.createMany(10)
    } catch (err: any) {
      Logger.error(err)
    }
  }
}
