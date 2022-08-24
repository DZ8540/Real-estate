import User from 'App/Models/Users/User'
import Message from 'App/Models/Chat/Message'
import Conversation from 'App/Models/Chat/Conversation'

export type MessageCreateWithoutTopicPayload = {
  toId: User['id'],
  fromId: User['id'],
}

export type ReturnMessageCreatePayload = {
  message: Message,
  conversation: Conversation,
}
