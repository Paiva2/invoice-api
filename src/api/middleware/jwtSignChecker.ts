import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import env from "../../env/env"
import { JwtSchema } from "../../@types/types"

export default function jwtSignChecker(
  req: Request,
  response: Response,
  next: NextFunction
) {
  const getJwt = req.cookies["invoice-auth"]

  try {
    const isTokenValid = jwt.verify(getJwt, env.JWT_KEY as string) as JwtSchema

    if (!isTokenValid)
      return response.status(403).send({ message: "Invalid token." })

    return next()
  } catch (e) {
    if (e instanceof Error) {
      return response.status(403).send({ message: e.message })
    }
  }
}
