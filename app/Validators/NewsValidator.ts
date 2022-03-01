import News from 'App/Models/News'
import BaseValidator from './BaseValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewsValidator extends BaseValidator {
  private readonly table: string = 'news'
  private readonly currentNewsSlug: News['slug'] | null = this.ctx.params.id ?? null

  constructor(protected ctx: HttpContextContract) {
    super()
  }

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    slug: schema.string.optional({}, [
      rules.unique({ table: this.table, column: 'slug', whereNot: { slug: this.currentNewsSlug } }),
    ]),
    title: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(255),
    ]),
    description: schema.string({}, [
      rules.minLength(10),
      rules.maxLength(8192),
    ]),
    readingTime: schema.number([
      rules.unsigned(),
    ]),
    image: schema.file.optional({
      extnames: ['jpg', 'png', 'jpeg'],
    }),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = this.messages
}
