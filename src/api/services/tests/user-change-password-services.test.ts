import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import UserChangePasswordServices from "../user/userChangePasswordServices"
import { compare } from "bcryptjs"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let sut: UserChangePasswordServices

describe("User Change Password Services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    userRegisterServices = new UserRegisterServices(userServicesMemory)

    sut = new UserChangePasswordServices(userServicesMemory)

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to change an user password", async () => {
    const { updatedUser } = await sut.execute({
      email: "test@test.com",
      newPassword: "12345678910",
    })

    const compareNewHashPassword = await compare(
      "12345678910",
      updatedUser.hashed_password
    )

    expect(compareNewHashPassword).toBe(true)

    expect(updatedUser).toEqual({
      id: expect.any(String),
      email: expect.any(String),
      username: expect.any(String),
      hashed_password: expect.any(String),
    })
  })

  it("should not be possible to change an user password if user doesnt exists", async () => {
    await expect(() => {
      return sut.execute({
        email: "inexistent@inexistent.com",
        newPassword: "12345678910",
      })
    }).rejects.toThrowError("User not found.")
  })

  it("should not be possible to change an user password if new password or email are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "",
        newPassword: "",
      })
    }).rejects.toThrowError("Invalid credentials.")
  })

  it("should not be possible to change an user password if new password doenst have at least 6 characters", async () => {
    await expect(() => {
      return sut.execute({
        email: "user test",
        newPassword: "12345",
      })
    }).rejects.toThrowError("Password must have at least 6 characters.")
  })
})
