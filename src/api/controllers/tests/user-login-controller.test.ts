/* import { describe, it, afterAll, beforeAll, expect } from "vitest"
import app from "../../../app"
import request from "supertest"
import pool from "../../../pgclient"
let server: any

describe("User Login Controller", () => {
  beforeAll(async () => {
    server = app.listen(0, () => console.log("Server running for tests"))

    await request(server).post("/user-register").send({
      username: "test",
      password: "123456",
    })
  })

  afterAll(async () => {
    await server.close()
  })

  it("should auth a registered user", async () => {
    const user = await request(server).post("/login").send({
      username: "test",
      password: "123456",
    })

    expect(user.statusCode).toEqual(200)
  })
})
 */