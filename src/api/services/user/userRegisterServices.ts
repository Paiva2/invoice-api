import { QueryResult } from "pg"
import { User } from "../../../@types/types"
import { UserRepository } from "../../repositories/implementations/user-repositories"
import { hash } from "bcryptjs"

interface UserRegisterServicesRequest {
  email: string
  username: string
  password: string
}

interface UserRegisterServicesResponse {
  newUser: User | QueryResult<User>
}

export default class UserRegisterServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    username,
    password,
  }: UserRegisterServicesRequest): Promise<UserRegisterServicesResponse> {
    if (!email || !password || !username) {
      throw new Error(
        "You must provide email, username and password to register."
      )
    } else if (password.length < 6) {
      throw new Error("Password must have at least 6 characters.")
    }

    const isThisUserRegistered = await this.userRepository.findUnique(email)

    if (isThisUserRegistered) {
      throw new Error("E-mail is already registered.")
    }

    const hashPassword = await hash(password, 6)

    const newUser = await this.userRepository.create({
      email,
      username,
      password: hashPassword,
    })

    return { newUser }
  }
}
