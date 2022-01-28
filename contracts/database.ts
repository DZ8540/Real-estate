import { SimplePaginatorContract } from '@ioc:Adonis/Lucid/Database'

declare module '@ioc:Adonis/Lucid/Orm' {
  interface ModelQueryBuilderContract<
    Model extends LucidModel,
    Result = InstanceType<Model>
  > {
    get(config: PaginationConfig): Promise<Result extends LucidRow ? ModelPaginatorContract<Result> : SimplePaginatorContract<Result>>,
    getForAPI(config: PaginationConfig): Promise<{ meta: any, data: any[] }>
  }
}

export type PaginationConfig = {
  page: number,
  baseURL: string,
  limit?: number,
  orderByColumn?: string,
  orderBy?: 'asc' | 'desc',
}

export type APIPaginationConfig = {
  page: number,
  limit?: number,
  orderByColumn?: string,
  orderBy?: 'asc' | 'desc',
}

