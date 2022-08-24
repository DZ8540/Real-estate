import User from 'App/Models/Users/User'

export type ConversationGetPayload = {
  toId: User['id'],
  fromId: User['id'],
}

export type ConversationGetWithoutTopicPayload = {
  toId: User['id'],
  fromId: User['id'],
}
