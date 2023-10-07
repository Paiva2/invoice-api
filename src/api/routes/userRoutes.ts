import { Express } from "express"
import UserControllers from "../controllers/user/userControllers"
import jwtSignChecker from "../middleware/jwtSignChecker"
import bodyValidityChecker from "../middleware/bodyValidityChecker"

const userControllers = new UserControllers()

export default function userRoutes(app: Express) {
  app.post(
    "/user-register",
    bodyValidityChecker,
    userControllers.userRegisterController
  )

  app.post("/login", bodyValidityChecker, userControllers.userLoginController)

  app.patch(
    "/change-credentials",
    bodyValidityChecker,
    userControllers.userChangePasswordController
  )

  app.get("/profile", jwtSignChecker, userControllers.getUserProfileController)

  app.patch(
    "/profile",
    [jwtSignChecker, bodyValidityChecker],
    userControllers.updateUserProfileController
  )
}
