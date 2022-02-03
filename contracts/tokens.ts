import User from 'App/Models/User'
import Token from 'App/Models/Token'

export type TokenPayload = {
  uuid: User['uuid'],
  firstName: User['firstName'],
  lastName: User['lastName'],
  email: User['email'],
  roleId: User['roleId'],
}

export type TokenCredentials = {
  token: Token['token'],
  fingerprint: Token['fingerprint'],
  ua: Token['ua'],
  ip: Token['ip'],
  userId: Token['userId'],
}
