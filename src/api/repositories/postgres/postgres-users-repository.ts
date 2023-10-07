import { QueryResult } from "pg"
import { User, NewUser } from "../../../@types/types"
import pool from "../../../pgclient"
import { UserRepository } from "../implementations/user-repositories"

export default class PostgresUsersRepository implements UserRepository {
  async create(data: NewUser) {
    const { username, password } = data

    const newUser = await pool.query<User>(
      "INSERT INTO users (username, hashed_password) VALUES ($1, $2) RETURNING *",
      [username, password]
    )

    return newUser.rows[0]
  }

  async findUnique(username: string) {
    const findUser = await pool.query<User>(
      "SELECT * FROM users WHERE username = $1",
      [username]
    )

    return findUser.rows[0]
  }

  async updatePassword(username: string, newPassword: string) {
    const updatedUser = await pool.query<User>(
      "UPDATE users SET hashed_password = $1 WHERE username = $2 RETURNING *",
      [newPassword, username]
    )

    return updatedUser.rows[0]
  }
}
