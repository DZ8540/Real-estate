import { TokenCredentials } from './tokens'
import { ResponseCodes, ResponseMessages } from './response'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ExtractModelRelations, LucidRow } from '@ioc:Adonis/Lucid/Orm'

export type GetAllConfig<M extends string> = {
  page: number,
  baseURL: string,
  limit?: number,
  columns?: M[],
  orderBy?: 'asc' | 'desc',
  orderByColumn?: M,
}

export type GetConfig<M extends LucidRow> = {
  column: string,
  val: string | number,
  trx?: TransactionClientContract,
  relations?: ExtractModelRelations<M>[],
}

export type Error = {
  code: ResponseCodes,
  message: ResponseMessages,
  body?: any,
}

export type RefreshRefreshTokenConfig = {
  userToken: string,
  payload: string,
  fingerprint: TokenCredentials['fingerprint'],
  ua: TokenCredentials['ua'],
  ip: TokenCredentials['ip'],
}
