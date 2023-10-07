import { JwtSchema } from "../../@types/types"
import jwt from "jsonwebtoken"

export default function retrieveJwt(token: string) {
  const { auth } = jwt.decode(token) as JwtSchema

  return auth
}
