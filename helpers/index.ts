import cyrillicToTranslit from 'cyrillic-to-translit-js'
import { string } from '@ioc:Adonis/Core/Helpers'
import Conversation from 'App/Models/Chat/Conversation'

export function camelCase(val: string): string {
  val = new cyrillicToTranslit().transform(val)

  return string.camelCase(val)
}

export function removeLastLetter(val: string): string {
  let valWithoutLastLetter: string = ''
  let arrayVal: string[] = [...val]
  arrayVal.pop()
  valWithoutLastLetter = arrayVal.join('')

  return valWithoutLastLetter
}

export function removeFirstWord(val: string, word: string): string {
  let valWithoutWord: string[] = [...val.replace(word, '')]
  let firstLetterLowerCase: string = valWithoutWord.shift()!.toLowerCase()
  let valWithoutFirstLetter: string = valWithoutWord.join('')

  return firstLetterLowerCase + valWithoutFirstLetter
}

export function getConversationRoomName(id: Conversation['id']): string {
  return `conversationRoom-${id}`
}
