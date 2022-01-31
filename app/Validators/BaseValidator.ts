export default class BaseValidator {
  protected messages = {
    unique: 'Значение уже занято!',
    required: '{{ field }} должно быть заполненным!',
    email: '{{ field }} должен быть в формате email!',
    minLength: '{{ field }} должно содержать от {{ options.minLength }} символов!',
    maxLength: '{{ field }} должно содержать максимум {{ options.maxLength }} символов!',
    mobile: '{{ field }} должно быть в формате телефона!',
  }
}
