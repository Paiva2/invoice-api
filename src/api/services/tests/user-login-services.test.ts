import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import UserLoginServices from "../user/userLoginServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let userLoginServices: UserLoginServices

describe("User Auth Services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    userLoginServices = new UserLoginServices(userServicesMemory)

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to auth if password and username matches", async () => {
    const authorizedUser = await userLoginServices.execute({
      email: "test@test.com",
      password: "123456",
    })

    expect(authorizedUser).toEqual({
      findUser: expect.objectContaining({
        id: expect.any(String),
        username: expect.any(String),
        hashed_password: expect.any(String),
      }),
    })
  })

  it("should not be possible to auth if password and username dont matches", async () => {
    await expect(() => {
      return userLoginServices.execute({
        email: "test@test.com",
        password: "non matching password",
      })
    }).rejects.toThrowError("Invalid credentials.")
  })

  it("should not be possible to auth if password or username are not provided", async () => {
    await expect(() => {
      return userLoginServices.execute({
        email: "test@test.com",
        password: "",
      })
    }).rejects.toThrowError("Invalid credentials.")
  })

  it("should not be possible to auth if username are not found on database", async () => {
    await expect(() => {
      return userLoginServices.execute({
        email: "inexistent@inexistent.com",
        password: "123456",
      })
    }).rejects.toThrowError("User not found.")
  })
})
