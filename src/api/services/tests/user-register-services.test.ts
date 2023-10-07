import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"

let sut: UserRegisterServices
let userServicesMemory: UserServicesMemory

describe("User Register Services", () => {
  beforeEach(() => {
    userServicesMemory = new UserServicesMemory()
    sut = new UserRegisterServices(userServicesMemory)
  })

  it("should register a new user", async () => {
    const newUser = await sut.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })

    expect(newUser).toEqual({
      newUser: expect.objectContaining({
        id: expect.any(String),
        username: expect.any(String),
        hashed_password: expect.any(String),
      }),
    })
  })

  it("should throw an error if password or username are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        username: "",
        password: "",
      })
    }).rejects.toThrowError(
      "You must provide email, username and password to register."
    )
  })

  it("should throw an error if password hasnt at least 6 characters", async () => {
    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        username: "user test",
        password: "12345",
      })
    }).rejects.toThrowError("Password must have at least 6 characters.")
  })

  it("should throw an error if username already exists", async () => {
    await sut.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })

    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        username: "user test",
        password: "123456",
      })
    }).rejects.toThrowError("E-mail is already registered.")
  })
})
