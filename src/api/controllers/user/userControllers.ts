import { Request, Response } from "express"
import PostgresUsersRepository from "../../repositories/postgres/postgres-users-repository"
import UserRegisterServices from "../../services/user/userRegisterServices"
import UserLoginServices from "../../services/user/userLoginServices"
import jwt from "jsonwebtoken"
import env from "../../../env/env"
import UserChangePasswordServices from "../../services/user/userChangePasswordServices"
import GetUserProfileServices from "../../services/user/getUserProfileServices"
import UpdateUserProfileServices from "../../services/user/updateUserProfileServices"
import retrieveJwt from "../../utils/retrieveJwt"

const postgresUsersRepository = new PostgresUsersRepository()

export default class UserControllers {
  async userRegisterController(req: Request, res: Response) {
    const { username, email, password } = req.body

    const userRegisterServices = new UserRegisterServices(
      postgresUsersRepository
    )

    try {
      await userRegisterServices.execute({
        email,
        username,
        password,
      })

      return res.status(201).send()
    } catch (e) {
      if (e instanceof Error) {
        return res.status(409).send({ message: e.message })
      }
    }
  }

  async userLoginController(req: Request, res: Response) {
    const { email, password } = req.body

    const userRegisterServices = new UserLoginServices(postgresUsersRepository)

    try {
      const user = await userRegisterServices.execute({
        email,
        password,
      })

      const jwtExpiration = 60 * 60 * 60 * 24 * 1 // 1 day

      const jwtToken = jwt.sign(
        {
          auth: {
            id: user.findUser.id,
            email: user.findUser.email,
          },
        },
        env.JWT_KEY as string,
        { expiresIn: jwtExpiration }
      )

      return res
        .status(200)
        .setHeader(
          "Set-Cookie",
          `invoice-auth=${jwtToken}; HttpOnly; Path=/; Max-Age=${jwtExpiration}; Expires=${jwtExpiration}`
        )
        .send()
    } catch (e) {
      if (e instanceof Error) {
        return res.status(403).send({ message: e.message })
      }
    }
  }

  async userChangePasswordController(req: Request, res: Response) {
    const { email, newPassword } = req.body

    const userChangePasswordServices = new UserChangePasswordServices(
      postgresUsersRepository
    )

    try {
      await userChangePasswordServices.execute({
        email,
        newPassword,
      })

      return res.status(200).send()
    } catch (e) {
      if (e instanceof Error) {
        return res.status(403).send({ message: e.message })
      }
    }
  }

  async getUserProfileController(req: Request, res: Response) {
    const getJwt = req.cookies["invoice-auth"]

    const userRepository = new PostgresUsersRepository()
    const userProfile = new GetUserProfileServices(userRepository)

    const auth = retrieveJwt(getJwt)

    try {
      const { findUserProfile } = await userProfile.execute({
        email: auth.email,
      })

      const user = {
        email: findUserProfile.email,
        username: findUserProfile.username,
        total_balance: Number(findUserProfile.total_balance),
        total_invoices: findUserProfile.totalInvoices,
      }

      return res.status(200).send({ data: user })
    } catch (e) {
      if (e instanceof Error) {
        return res.status(404).send({ message: e.message })
      }
    }
  }

  async updateUserProfileController(req: Request, res: Response) {
    const { username, total_balance } = req.body
    const getJwt = req.cookies["invoice-auth"]

    const auth = retrieveJwt(getJwt)

    const updateProfileServices = new UpdateUserProfileServices(
      postgresUsersRepository
    )

    try {
      const { updatedUser } = await updateProfileServices.execute({
        username,
        email: auth.email,
        total_balance,
      })

      return res.status(200).send({
        data: {
          ...updatedUser,
          total_balance: Number(updatedUser.total_balance),
        },
      })
    } catch (e) {
      if (e instanceof Error) {
        return res.status(404).send({ message: e.message })
      }
    }
  }
}
