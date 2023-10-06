import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory

describe("User Register Services", () => {
  beforeEach(() => {
    userServicesMemory = new UserServicesMemory()
    userRegisterServices = new UserRegisterServices(userServicesMemory)
  })

  it("should register a new user", async () => {
    const newUser = await userRegisterServices.execute({
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
      return userRegisterServices.execute({
        username: "",
        password: "",
      })
    }).rejects.toThrowError(
      "You must provide username and password to register."
    )
  })

  it("should throw an error if password hasnt at least 6 characters", async () => {
    await expect(() => {
      return userRegisterServices.execute({
        username: "user test",
        password: "12345",
      })
    }).rejects.toThrowError("Password must have at least 6 characters.")
  })

  it("should throw an error if username already exists", async () => {
    await userRegisterServices.execute({
      username: "user test",
      password: "123456",
    })

    await expect(() => {
      return userRegisterServices.execute({
        username: "user test",
        password: "123456",
      })
    }).rejects.toThrowError("Username is already registered.")
  })
})
