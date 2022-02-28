import BaseValidator from 'App/Validators/BaseValidator'
import { Sex } from 'Config/users'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator extends BaseValidator {
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
    firstName: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(50),
    ]),
    lastName: schema.string({}, [
      rules.minLength(2),
      rules.maxLength(50),
    ]),
    sex: schema.number.optional([
      rules.unsigned(),
      rules.range(Sex.MAN, Sex.WOMAN),
    ]),
    birthday: schema.date.optional({ format: 'dd.mm.yyyy' }, [
      rules.before('today'),
    ]),
    phone: schema.string.optional({}, [
      rules.mobile(),
    ]),
    email: schema.string({}, [
      rules.email(),
    ]),
    isSubscribed: schema.boolean.optional(),
    avatar: schema.file.optional({
      extnames: ['jpg', 'gif', 'png', 'jpeg', 'webp']
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
