import ApiValidator from '../ApiValidator'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// import { ExperienceTypes } from 'Contracts/services'

export default class ServiceValidator extends ApiValidator {
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
    ...this.preParsedSchema,
    // experienceTypes: schema.array.optional().members(schema.number([
    //   rules.unsigned(),
    //   rules.range(ExperienceTypes.BEFORE_ONE_YEAR, ExperienceTypes.BEFORE_TEN_YEAR),
    // ])),
    subServicesTypes: schema.array.optional().members(schema.number([ rules.unsigned() ])),
    attributesTypes: schema.array.optional().members(schema.number([ rules.unsigned() ])),
    servicesTypeId: schema.number.optional([
      rules.unsigned(),
      rules.exists({ table: 'servicesTypes', column: 'id' }),
    ]),
    labels: schema.array.optional().members(schema.number([
      rules.unsigned(),
      rules.exists({ table: 'labels', column: 'id' })
    ])),
    rating: schema.enum.optional(['asc', 'desc'] as const),
    districts: schema.array.optional().members(schema.number([
      rules.unsigned(),
    ])),
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
