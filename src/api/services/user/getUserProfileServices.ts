import { User } from "../../../@types/types"
import { UserRepository } from "../../repositories/implementations/user-repositories"

interface GetUserProfileServicesRequest {
  email: string
}

interface GetUserProfileServicesResponse {
  findUserProfile: User
}

export default class GetUserProfileServices {
  constructor(private userRepository: UserRepository) {}

  async execute({
    email,
  }: GetUserProfileServicesRequest): Promise<GetUserProfileServicesResponse> {
    if (!email) {
      throw new Error("You must provide an valid e-mail.")
    }

    const findUserProfile = (await this.userRepository.findUnique(
      email
    )) as User

    if (!findUserProfile) {
      throw new Error("User profile not found.")
    }

    return { findUserProfile }
  }
}
