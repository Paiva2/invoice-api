import { Express } from "express"
import UserControllers from "../controllers/user/userControllers"

const userControllers = new UserControllers()

export default function userRoutes(app: Express) {
  app.post("/user-register", userControllers.userRegisterController)

  app.post("/login", userControllers.userLoginController)
}
