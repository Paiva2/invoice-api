import express, { Express } from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"

const app: Express = express()

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

export default app
