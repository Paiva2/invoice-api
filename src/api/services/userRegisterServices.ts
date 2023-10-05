import { QueryResult } from "pg"
import { User } from "../../@types/types"
import { UserRepository } from "../repositories/implementations/user-repositories"

interface UserRegisterServicesRequest {
  username: string
  password: string
}

interface UserRegisterServicesResponse {
  newUser: User | QueryResult<User>
}

export default class UserRegisterServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
    password,
  }: UserRegisterServicesRequest): Promise<UserRegisterServicesResponse> {
    const newUser = await this.userRepository.create({
      password,
      username,
    })

    return { newUser }
  }
}
