import { Environment } from "vitest"
import pool from "../pgclient"

export default <Environment>{
  name: "postgres",
  transformMode: "web",

  async setup() {
    await pool.query("CREATE SCHEMA IF NOT EXISTS public")

    await pool.query(
      "CREATE TABLE IF NOT EXISTS public.users(id SERIAL PRIMARY KEY, username VARCHAR(100), hashed_password VARCHAR(100))"
    )

    return {
      async teardown() {
        await pool.query("DROP SCHEMA public CASCADE")
      },
    }
  },
}
