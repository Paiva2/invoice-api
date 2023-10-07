import { QueryResult } from "pg"
import { NewUser, User } from "../../../@types/types"

export interface UserRepository {
  create(data: NewUser): Promise<User> | Promise<QueryResult<User>>
  findUnique(
    username: string
  ): Promise<User | null> | Promise<QueryResult<User>>
  updatePassword(
    username: string,
    newPassword: string
  ): Promise<User | null> | Promise<QueryResult<User>>
}
