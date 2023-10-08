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

async function initDatabase() {
  try {
    await pool.query("BEGIN;")

    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

    await pool.query(
      `
    CREATE TABLE IF NOT EXISTS 
    users(id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(100) UNIQUE,
      username varchar(100),
      hashed_password VARCHAR(100))
    `
    )

    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoice(
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        street_from varchar(100),
        city_from varchar(50),
        zipcode_from varchar(30),
        country_from varchar(50),
        name_to varchar(50),
        email_to varchar(50),
        street_to varchar(100),
        city_to varchar(500),
        zipcode_to varchar(30),
        country_to varchar(50),
        invoice_date varchar(30),
        fkInvoiceOwner varchar(100) not null,
        foreign key(fkInvoiceOwner) references users(email)
      )
  `)

    await pool.query(`
      CREATE TABLE IF NOT EXISTS 
      item_list(
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        fkItemListOwner uuid not null,
        item_name varchar(100),
        quantity bigint,
        price bigint,
        total numeric GENERATED ALWAYS AS (quantity * price) STORED,
        foreign key(fkItemListOwner) references invoice(id)
      )
  `)

    await pool.query("COMMIT;")

    await pool.query("END;")
  } catch {
    throw new Error("Error while generating database.")
  }
}

initDatabase()

export default pool
