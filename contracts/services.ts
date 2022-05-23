import { TokenCredentials } from './tokens'
import { ResponseCodes, ResponseMessages } from './response'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import { ExtractModelRelations, LucidRow, ModelObject } from '@ioc:Adonis/Lucid/Orm'

export type PaginateConfig<C extends string, M extends LucidRow = LucidRow> = {
  page: number,
  baseURL?: string,
  limit?: number,
  orderBy?: 'asc' | 'desc',
  orderByColumn?: C,
  relations?: ExtractModelRelations<M>[],
}

export type ServiceConfig<M extends LucidRow> = {
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

export type JSONPaginate = {
  meta: any,
  data: ModelObject[],
}

export enum ExperienceTypes {
  BEFORE_ONE_YEAR = 0,
  BEFORE_THREE_YEAR = 1,
  BEFORE_SIX_YEAR = 2,
  BEFORE_TEN_YEAR = 3,
}
