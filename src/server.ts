import app from "./app"
import env from "./env/env"

const server = app.listen(3000, () => {
  console.log(`Running on port ${env.PORT}`)
})

export default server
