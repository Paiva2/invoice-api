import { QueryResult } from "pg"
import { User } from "../../@types/types"
import { UserRepository } from "../repositories/implementations/user-repositories"
import { hash } from "bcryptjs"

interface UserRegisterServicesRequest {
  username: string
  password: string
}

interface UserRegisterServicesResponse {
  newUser: /* User | QueryResult<User> */ any
}

export default class UserRegisterServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
    password,
  }: UserRegisterServicesRequest): /* Promise<UserRegisterServicesResponse> */ Promise<any> {
    if (!username || !password) {
      throw new Error("You must provide username and password to register.")
    } else if (password.length < 6) {
      throw new Error("Password must have at least 6 characters.")
    }

    const isThisUserRegistered = await this.userRepository.findUnique(username)

    if (isThisUserRegistered) {
      throw new Error("Username is already registered.")
    }

    const hashPassword = await hash(password, 6)

    const newUser = await this.userRepository.create({
      password: hashPassword,
      username,
    })

    return { newUser }
  }
}
