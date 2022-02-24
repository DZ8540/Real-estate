import BaseValidator from '../BaseValidator'
import { OwnerTypes } from 'Contracts/users'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator extends BaseValidator {
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
    ownerType: schema.number([
      rules.required(),
      rules.unsigned(),
      rules.range(OwnerTypes.OWNER, OwnerTypes.AGENT)
    ]),
    firstName: schema.string({}, [
      rules.required(),
      rules.minLength(2),
      rules.maxLength(30),
    ]),
    lastName: schema.string({}, [
      rules.required(),
      rules.minLength(2),
      rules.maxLength(30),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.required(),
      rules.unique({ table: 'users', column: 'email' })
    ]),
    password: schema.string({}, [
      rules.required(),
      rules.minLength(8),
      rules.maxLength(30),
      rules.containNumber(),
      rules.containUppercase(),
    ]),
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
