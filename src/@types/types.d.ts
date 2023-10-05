export type NewUser = {
  username: string
  password: string
}

export type User = {
  id: number | string
  username: string
  hashed_password: string
}
