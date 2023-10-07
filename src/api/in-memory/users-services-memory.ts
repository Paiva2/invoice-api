import { randomUUID } from "node:crypto"
import { UserRepository } from "../repositories/implementations/user-repositories"
import { NewUser, User } from "../../@types/types"
import { QueryResult } from "pg"

export default class UserServicesMemory implements UserRepository {
  private users: User[] = []

  async updatePassword(username: string, newPassword: string) {
    let getUserUpdated: User | null = null

    for (let user of this.users) {
      if (user.username === username) {
        user.hashed_password = newPassword

        return (getUserUpdated = user)
      }
    }

    return getUserUpdated
  }

  async findUnique(username: string) {
    const findUser = this.users.find((user) => user.username === username)

    if (!findUser) {
      return null
    }

    return findUser
  }

  async create(data: NewUser) {
    const newUser = {
      id: randomUUID(),
      username: data.username,
      hashed_password: data.password,
    }

    this.users.push(newUser)

    return newUser
  }
}
