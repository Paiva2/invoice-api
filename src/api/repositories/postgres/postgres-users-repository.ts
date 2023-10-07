import { QueryResult } from "pg"
import { User, NewUser, UpdateUserProfileSchema } from "../../../@types/types"
import pool from "../../../pgclient"
import { UserRepository } from "../implementations/user-repositories"

export default class PostgresUsersRepository implements UserRepository {
  async updateUserProfileInformations(data: UpdateUserProfileSchema) {
    const { email, ...params } = data

    let updatedProfile: User = {} as User
    const getParametersToUpdate = Object.keys(params)

    const findUser = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    for (let param of getParametersToUpdate) {
      if (data[param as keyof typeof data]) {
        updatedProfile = {
          ...findUser.rows[0],
          ...updatedProfile,
          [param]: data[param as keyof typeof data],
        }
      }
    }

    const newUser = await pool.query<User>(
      "UPDATE users SET total_balance = $1, username = $2 WHERE email = $3 RETURNING username, total_balance, email",
      [
        updatedProfile.total_balance,
        updatedProfile.username,
        updatedProfile.email,
      ]
    )

    return newUser.rows[0]
  }

  async create(data: NewUser) {
    const { username, password, email } = data

    const newUser = await pool.query<User>(
      "INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, password]
    )

    return newUser.rows[0]
  }

  async findUnique(email: string) {
    const findUser = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    return findUser.rows[0]
  }

  async updatePassword(email: string, newPassword: string) {
    const updatedUser = await pool.query<User>(
      "UPDATE users SET hashed_password = $1 WHERE email = $2 RETURNING *",
      [newPassword, email]
    )

    return updatedUser.rows[0]
  }
}
