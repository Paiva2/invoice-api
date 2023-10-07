/* import { afterAll, beforeAll } from "vitest"
import pool from "../pgclient"
import app from "../app"

let serverTest: any

beforeAll(async () => {
  serverTest = app.listen(0, () => console.log("Server running for tests"))

  await pool.query("CREATE SCHEMA IF NOT EXISTS public")

  await pool.query(
    "CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, username VARCHAR(100), hashed_password VARCHAR(100))"
  )
})

afterAll(async () => {
  serverTest.close()

  await pool.end()
})

export default serverTest
 */