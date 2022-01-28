export type GetAllConfig<M extends string[]> = {
  page: number,
  baseURL: string,
  limit?: number,
  columns?: M
}
