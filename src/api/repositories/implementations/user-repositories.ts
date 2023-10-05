import { QueryResult } from "pg"
import { NewUser, User } from "../../../@types/types"

export interface UserRepository {
  create(data: NewUser): Promise<User> | Promise<QueryResult<User>>
}
