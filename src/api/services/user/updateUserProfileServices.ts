import { User } from "../../../@types/types"
import { UserRepository } from "../../repositories/implementations/user-repositories"

interface UpdateUserProfileServicesRequest {
  email: string
  username?: string
  total_balance?: string
}

interface UpdateUserProfileServicesResponse {
  updatedUser: User
}

export default class UpdateUserProfileServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
    username,
    total_balance,
  }: UpdateUserProfileServicesRequest): Promise<UpdateUserProfileServicesResponse> {
    if (!email) {
      throw new Error("Invalid e-mail profile.")
    }

    const findUserToUpdate = await this.userRepository.findUnique(email)

    if (!findUserToUpdate) {
      throw new Error("Invalid e-mail profile.")
    }

    const updatedUser =
      (await this.userRepository.updateUserProfileInformations({
        email,
        total_balance,
        username,
      })) as User

    return { updatedUser }
  }
}
