import { Express } from "express"
import UserControllers from "../controllers/user/userControllers"
import jwtSignChecker from "../middleware/jwtSignChecker"
import {
  updateUserProfileSchema,
  userChangePasswordSchema,
  userLoginSchema,
  userRegisterSchema,
} from "../schemas/user/userSchemas"
import bodySchemaChecker from "../middleware/bodySchemaChecker"

const userControllers = new UserControllers()

export default function userRoutes(app: Express) {
  app.post(
    "/user-register",
    [bodySchemaChecker(userRegisterSchema)],
    userControllers.userRegisterController
  )

  app.post(
    "/login",
    [bodySchemaChecker(userLoginSchema)],
    userControllers.userLoginController
  )

  app.patch(
    "/change-credentials",
    [bodySchemaChecker(userChangePasswordSchema)],
    userControllers.userChangePasswordController
  )

  app.get("/profile", jwtSignChecker, userControllers.getUserProfileController)

  app.patch(
    "/profile",
    [jwtSignChecker, bodySchemaChecker(updateUserProfileSchema)],
    userControllers.updateUserProfileController
  )
}
