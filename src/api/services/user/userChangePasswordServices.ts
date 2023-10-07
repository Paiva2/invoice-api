import { hash } from "bcryptjs"
import { User } from "../../../@types/types"
import { UserRepository } from "../../repositories/implementations/user-repositories"

interface UserChangePasswordRequest {
  username: string
  newPassword: string
}

interface UserChangePasswordResponse {
  updatedUser: User
}

export default class UserChangePasswordServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
    newPassword,
  }: UserChangePasswordRequest): Promise<UserChangePasswordResponse> {
    if (!username || !newPassword) {
      throw new Error("Invalid credentials.")
    } else if (newPassword.length < 6) {
      throw new Error("Password must have at least 6 characters.")
    }

    const findUser = (await this.userRepository.findUnique(username)) as User

    if (!findUser) {
      throw new Error("User not found.")
    }

    const hashNewPassword = await hash(newPassword, 6)

    const updatedUser = (await this.userRepository.updatePassword(
      username,
      hashNewPassword
    )) as User

    return { updatedUser }
  }
}
