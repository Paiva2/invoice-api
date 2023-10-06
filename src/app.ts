import express, { Express } from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRoutes from "./api/routes/userRoutes"

const app: Express = express()

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

userRoutes(app)

export default app
