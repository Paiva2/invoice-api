import app from "./app"
import env from "./env/env"

app.get("/", (req, res) => {
  return res.status(200).send("Working")
})

const server = app.listen(3000, () => {
  console.log(`Running on port ${env.PORT}`)
})

export default server
