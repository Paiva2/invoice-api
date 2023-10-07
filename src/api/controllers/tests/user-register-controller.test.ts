/* import { describe, it, afterAll, beforeAll, expect } from "vitest"
import app from "../../../app"
import request from "supertest"
import pool from "../../../pgclient"
let server: any

describe("User Register Controller", () => {
  beforeAll(async () => {
    server = app.listen(0, () => console.log("Server running for tests"))

    await pool.query("CREATE SCHEMA IF NOT EXISTS public")

    await pool.query(
      "CREATE TABLE IF NOT EXISTS users(id SERIAL PRIMARY KEY, username VARCHAR(100), hashed_password VARCHAR(100))"
    )
  })

  afterAll(async () => {
    await pool.query("TRUNCATE TABLE users")

    server.close()
  })

  it("should register a new user", async () => {
    const newUser = await request(server).post("/user-register").send({
      username: "New User",
      password: "123456",
    })

    expect(newUser.statusCode).toEqual(201)
  })

  it("should throw an error if user is already registered", async () => {
    await request(server).post("/user-register").send({
      username: "test123",
      password: "123456",
    })

    const newUser = await request(server).post("/user-register").send({
      username: "test123",
      password: "123456",
    })

    expect(newUser.statusCode).toEqual(409)
    expect(newUser.body.message).toEqual("Username is already registered.")
  })

  it("should throw an error if username or password are not provided.", async () => {
    const newUser = await request(server).post("/user-register").send({
      username: "",
      password: "",
    })

    expect(newUser.statusCode).toEqual(409)
    expect(newUser.body.message).toEqual(
      "You must provide username and password to register."
    )
  })

  it("should throw an error if password has less than 6 characters.", async () => {
    const newUser = await request(server).post("/user-register").send({
      username: "user-test",
      password: "12345",
    })

    expect(newUser.statusCode).toEqual(409)
    expect(newUser.body.message).toEqual(
      "Password must have at least 6 characters."
    )
  })
})
 */