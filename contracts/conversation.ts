import User from 'App/Models/Users/User'
import Service from 'App/Models/Services/Service'
import RealEstate from 'App/Models/RealEstates/RealEstate'

export type ConversationGetPayload = {
  toId: User['id'],
  fromId: User['id'],
  realEstateId?: RealEstate['id'],
  serviceId?: Service['id'],
}

export type ConversationGetWithoutTopicPayload = {
  toId: User['id'],
  fromId: User['id'],
}
