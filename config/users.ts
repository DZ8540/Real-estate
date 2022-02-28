export const OWNER_TYPES = ['Собственник', 'Агент'] as const
export enum OwnerTypes {
  OWNER = 0,
  AGENT = 1,
}

export const SEX_TYPES = ['Мужской', 'Женский'] as const
export enum Sex {
  MAN = 0,
  WOMAN = 1,
}

export enum Roles {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}
