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
      "SELECT * from users WHERE username = $1",
      [username]
    )

    return findUser.rows[0]
  }
}
