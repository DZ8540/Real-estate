import User from "App/Models/Users/User"

export const SESSION_USER_KEY: string = 'user'
export const COOKIE_REFRESH_TOKEN_KEY = 'refreshToken'

export type SessionUser = {
  uuid: User['uuid'],
  fullName: User['fullName']
}
