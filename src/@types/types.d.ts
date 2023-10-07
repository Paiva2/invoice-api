export type NewUser = {
  username: string
  password: string
  email: string
  total_balance?: string
}

export type User = {
  id: number | string
  username: string
  email: string
  hashed_password: string
  total_balance?: string
}

export type JwtSchema = {
  auth: {
    id: number
    email: string
  }
  iat: number
  exp: number
}

export type UpdateUserProfileSchema = {
  email: string
  username?: string
  total_balance?: string
}
