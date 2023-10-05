import { Pool } from "pg"
import env from "./env/env"

const pool = new Pool({
  user: env.POSTGRESQL_USER,
  password: env.POSTGRESQL_PASS,
  host: "localhost",
  database: "postgres",
  port: env.POSTGRES_PORT ? +env.POSTGRES_PORT : 5432,
})

export default pool
