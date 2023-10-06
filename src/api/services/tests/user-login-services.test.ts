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
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to auth if password and username matches", async () => {
    const authorizedUser = await userLoginServices.execute({
      username: "user test",
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
        username: "user test",
        password: "1234567",
      })
    }).rejects.toThrowError("Invalid credentials.")
  })

  it("should not be possible to auth if password or username are not provided", async () => {
    await expect(() => {
      return userLoginServices.execute({
        username: "",
        password: "",
      })
    }).rejects.toThrowError("Invalid credentials.")
  })

  it("should not be possible to auth if username are not found on database", async () => {
    await expect(() => {
      return userLoginServices.execute({
        username: "inexistent user",
        password: "123456",
      })
    }).rejects.toThrowError("User not found.")
  })
})
