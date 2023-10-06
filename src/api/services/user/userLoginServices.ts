import { User } from "../../../@types/types"
import { UserRepository } from "../../repositories/implementations/user-repositories"
import { compare } from "bcryptjs"

interface UserLoginServicesRequest {
  username: string
  password: string
}

interface UserLoginServicesResponse {
  findUser: User
}

export default class UserLoginServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
    password,
  }: UserLoginServicesRequest): Promise<UserLoginServicesResponse> {
    if (!username || !password) {
      throw new Error("Invalid credentials.")
    }

    const findUser = (await this.userRepository.findUnique(username)) as User

    if (!findUser) {
      throw new Error("User not found.")
    }

    const hashedPasswordMatches = await compare(
      password,
      findUser.hashed_password
    )

    if (!hashedPasswordMatches) {
      throw new Error("Invalid credentials.")
    }

    return { findUser }
  }
}
