import { TokenCredentials } from './tokens'

export const SESSION_USER_KEY: string = 'user'
export const COOKIE_REFRESH_TOKEN_KEY = 'refreshToken'

export type LoginHeaders = {
  fingerprint: TokenCredentials['fingerprint'],
  ua: TokenCredentials['ua'],
  ip: TokenCredentials['ip'],
}
