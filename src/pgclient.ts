import { Pool } from "pg"
import env from "./env/env"

const pool = new Pool({
  user: env.POSTGRESQL_USER,
  password:
    process.env.NODE_ENV !== "test" ? env.POSTGRESQL_PASS : "postgres_test123",
  host: "localhost",
  port: env.POSTGRES_PORT ? +env.POSTGRES_PORT : 5433,
  database: process.env.NODE_ENV === "test" ? "postgres_test" : "postgres",
})

export default pool
