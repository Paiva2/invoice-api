import userRoutes from "./api/routes/userRoutes"
import app from "./app"
import env from "./env/env"
import pool from "./pgclient"

userRoutes(app)

const server = app.listen(3000, () => {
  console.log(`Running on port ${env.PORT}`)
})

export default server
