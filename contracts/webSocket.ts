import User from 'App/Models/Users/User'
import Message from 'App/Models/Chat/Message'
import Conversation from 'App/Models/Chat/Conversation'
import ResponseService from 'App/Services/ResponseService'
import ApiValidator from 'App/Validators/Api/ApiValidator'
import MessageWithoutTopicValidator from 'App/Validators/Api/Message/MessageWithoutTopicValidator'
import MessageWithServiceTopicValidator from 'App/Validators/Api/Message/MessageWithServiceTopicValidator'
import MessageWithRealEstateTopicValidator from 'App/Validators/Api/Message/MessageWithRealEstateTopicValidator'
import { Error } from './services'
import { SocketId } from 'socket.io-adapter'

export interface ServerToClientEvents {
  /**
   * * Conversation
   */

  'conversation:countNewMessages': (count: number) => void,
  'conversation:update': (conversation: Conversation) => void,

  /**
   * * Message
   */

  'message:viewed': () => void,
  'message:create': (message: Message) => void,
  'message:update': (message: Message) => void,
  'message:delete': (messagesIds: Message['id'][]) => void,
}

export interface ClientToServerEvents {
  /**
   * * Conversation
   */

  'conversation:get': (conversationId: Conversation['id'], cb: (response: Error | ResponseService) => void) => void,
  'conversation:close': (conversationId: Conversation['id'], cb: (response: Error | ResponseService) => void) => void,
  'conversation:paginate': (payload: ApiValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,

  /**
   * * Message
   */

  'message:viewed': (conversationId: Conversation['id'], userId: User['id'], cb: (response: Error | ResponseService) => void) => void,
  'message:delete': (messagesIds: Message['id'][], conversationId: Conversation['id'], cb: (response: Error | ResponseService) => void) => void,
  'message:update': (messageId: Message['id'], payload: MessageWithoutTopicValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,
  'message:paginate': (conversationId: Conversation['id'], payload: ApiValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,

  /**
   * * Create
   */

  'message:create': (payload: MessageWithoutTopicValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,
  'message:createWithoutTopic': (toId: User['id'], payload: MessageWithoutTopicValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,
  'message:createWithServiceTopic': (toId: User['id'], payload: MessageWithServiceTopicValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,
  'message:createWithRealEstateTopic': (toId: User['id'], payload: MessageWithRealEstateTopicValidator['schema']['props'], cb: (response: Error | ResponseService) => void) => void,
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: User['id'],
}

export type AllSockets = {
  sockets: SomeSocket[],
  getSocket: (userId: User['id']) => SomeSocket | undefined,
  addSocket: (socket: SomeSocket) => void,
  removeSocket: (userId: User['id']) => void,
}

export type SomeSocket = {
  userId: User['id'],
  socketId: SocketId,
}
