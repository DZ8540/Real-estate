import { string } from '@ioc:Adonis/Core/Helpers'
import cyrillicToTranslit from 'cyrillic-to-translit-js'

export function createSlug(val: string): string {
  val = new cyrillicToTranslit().transform(val)

  return string.camelCase(val)
}
