import { randomUUID } from "crypto"
import { UserRepository } from "../repositories/implementations/user-repositories"
import { NewUser, User } from "../../@types/types"

export default class OrgServicesMemory implements UserRepository {
  private users: User[] = []

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
