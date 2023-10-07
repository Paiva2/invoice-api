import { randomUUID } from "node:crypto"
import { UserRepository } from "../repositories/implementations/user-repositories"
import { NewUser, User } from "../../@types/types"
import { QueryResult } from "pg"

export default class UserServicesMemory implements UserRepository {
  private users: User[] = []

  async updatePassword(email: string, newPassword: string) {
    let getUserUpdated: User | null = null

    for (let user of this.users) {
      if (user.email === email) {
        user.hashed_password = newPassword

        return (getUserUpdated = user)
      }
    }

    return getUserUpdated
  }

  async findUnique(email: string) {
    const findUser = this.users.find((user) => user.email === email)

    if (!findUser) {
      return null
    }

    return findUser
  }

  async create(data: NewUser) {
    const newUser = {
      id: randomUUID(),
      email: data.email,
      username: data.username,
      hashed_password: data.password,
    }

    this.users.push(newUser)

    return newUser
  }
}
