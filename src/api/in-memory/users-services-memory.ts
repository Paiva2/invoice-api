import { randomUUID } from "node:crypto"
import { UserRepository } from "../repositories/implementations/user-repositories"
import { NewUser, User } from "../../@types/types"

export default class UserServicesMemory implements UserRepository {
  private users: User[] = []

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
