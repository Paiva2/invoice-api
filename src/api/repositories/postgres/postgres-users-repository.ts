import { QueryResult } from "pg"
import { User, NewUser } from "../../../@types/types"
import pool from "../../../pgclient"
import { UserRepository } from "../implementations/user-repositories"

export default class PostgresUsersRepository implements UserRepository {
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
