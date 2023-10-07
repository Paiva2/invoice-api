import { QueryResult } from "pg"
import { NewUser, UpdateUserProfileSchema, User } from "../../../@types/types"

export interface UserRepository {
  create(data: NewUser): Promise<User> | Promise<QueryResult<User>>
  findUnique(email: string): Promise<User | null> | Promise<QueryResult<User>>
  updatePassword(
    username: string,
    newPassword: string
  ): Promise<User | null> | Promise<QueryResult<User>>
  updateUserProfileInformations(
    data: UpdateUserProfileSchema
  ): Promise<User | null> | Promise<QueryResult<User>>
}
