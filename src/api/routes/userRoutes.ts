import { Express } from "express"
import UserControllers from "../controllers/userControllers"

const userControllers = new UserControllers()

export default function userRoutes(app: Express) {
  app.post("/user-register", userControllers.userRegisterController)
}
