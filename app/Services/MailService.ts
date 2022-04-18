import Env from '@ioc:Adonis/Core/Env'
import BaseService from './BaseService'
import Logger from '@ioc:Adonis/Core/Logger'
import Mail, { MailerConfig } from '@ioc:Adonis/Addons/Mail'
import { Error } from 'Contracts/services'
import { ResponseCodes, ResponseMessages } from 'Contracts/response'

export default class MailService extends BaseService {
  public static async sendMail(config: MailerConfig): Promise<void> {
    if (!config.from)
      config.from = Env.get('SMTP_FROM')

    try {
      await Mail.send((message) => {
        message
          .from(config.from!)
          .to(config.to)
          .subject(config.title)
          .htmlView(config.template, config.data)
      })
    } catch (err: any) {
      Logger.error(err)
      throw { code: ResponseCodes.MAILER_ERROR, message: ResponseMessages.EMAIL_NOT_FOUND } as Error
    }
  }
}
