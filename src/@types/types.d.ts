export type NewUser = {
  username: string
  password: string
  email: string
}

export type User = {
  id: number | string
  username: string
  email: string
  hashed_password: string
}
