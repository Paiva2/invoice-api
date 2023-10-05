import { Request, Response } from "express"
import PostgresUsersRepository from "../repositories/postgres/postgres-users-repository"
import UserRegisterServices from "../services/userRegisterServices"

export default class UserControllers {
  async userRegisterController(req: Request, res: Response) {
    const { username, password } = req.body

    const postgresUsersRepository = new PostgresUsersRepository()
    const userRegisterServices = new UserRegisterServices(
      postgresUsersRepository
    )

    try {
      await userRegisterServices.execute({
        username,
        password,
      })

      return res.status(201).send()
    } catch {
      return res.status(500).send()
    }
  }
}
