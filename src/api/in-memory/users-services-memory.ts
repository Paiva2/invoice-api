import { randomUUID } from "node:crypto"
import { UserRepository } from "../repositories/implementations/user-repositories"
import { NewUser, UpdateUserProfileSchema, User } from "../../@types/types"

export default class UserServicesMemory implements UserRepository {
  private users: User[] = []

  async updateUserProfileInformations(data: UpdateUserProfileSchema) {
    const { email, ...params } = data

    let userUpdated: User = {} as User

    const checkParametersToUpdate = Object.keys(params)

    const findUser = this.users.find((user) => user.email === email)

    if (!findUser) return null

    for (let param of checkParametersToUpdate) {
      if (data[param as keyof typeof data]) {
        userUpdated = {
          ...findUser,
          ...userUpdated,
          [param]: data[param as keyof typeof data],
        }
      }
    }

    const updateDb = this.users.map((user) => {
      if (user.email === email) {
        user = userUpdated
      }

      return user
    })

    this.users = updateDb

    return userUpdated
  }

  async updatePassword(email: string, newPassword: string) {
    let getUserUpdated: User | null = null

    for (let user of this.users) {
      if (user.email === email) {
        user.hashed_password = newPassword

        getUserUpdated = user

        break
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
      total_balance: "0",
    }

    this.users.push(newUser)

    return newUser
  }
}
