import { describe, it, expect, beforeEach, beforeAll } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import UserChangePasswordServices from "../user/userChangePasswordServices"
import { compare } from "bcryptjs"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let userChangePasswordServices: UserChangePasswordServices

describe("User Change Password Services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    userRegisterServices = new UserRegisterServices(userServicesMemory)

    userChangePasswordServices = new UserChangePasswordServices(
      userServicesMemory
    )

    await userRegisterServices.execute({
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to change an user password", async () => {
    const { updatedUser } = await userChangePasswordServices.execute({
      username: "user test",
      newPassword: "12345678910",
    })

    const compareNewHashPassword = await compare(
      "12345678910",
      updatedUser.hashed_password
    )

    expect(compareNewHashPassword).toBe(true)

    expect(updatedUser).toEqual({
      id: expect.any(String),
      username: expect.any(String),
      hashed_password: expect.any(String),
    })
  })

  it("should not be possible to change an user password if user doesnt exists", async () => {
    await expect(() => {
      return userChangePasswordServices.execute({
        username: "inexistent user",
        newPassword: "12345678910",
      })
    }).rejects.toThrowError("User not found.")
  })

  it("should not be possible to change an user password if new password or username are not provided", async () => {
    await expect(() => {
      return userChangePasswordServices.execute({
        username: "",
        newPassword: "",
      })
    }).rejects.toThrowError("Invalid credentials.")
  })

  it("should not be possible to change an user password if new password doenst have at least 6 characters", async () => {
    await expect(() => {
      return userChangePasswordServices.execute({
        username: "user test",
        newPassword: "12345",
      })
    }).rejects.toThrowError("Password must have at least 6 characters.")
  })
})
