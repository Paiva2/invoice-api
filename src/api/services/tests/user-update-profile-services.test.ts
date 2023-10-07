import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import UpdateUserProfileServices from "../user/updateUserProfileServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory

let sut: UpdateUserProfileServices

describe("User update profile services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    sut = new UpdateUserProfileServices(userServicesMemory)
  })

  it("should be possible to update user profile informations", async () => {
    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })

    const { updatedUser } = await sut.execute({
      email: "test@test.com",
      username: "new username",
      total_balance: "1000",
    })

    expect(updatedUser).toEqual({
      id: expect.any(String),
      email: "test@test.com",
      username: "new username",
      total_balance: "1000",
      hashed_password: expect.any(String),
    })

    const { updatedUser: secondUpdate } = await sut.execute({
      email: "test@test.com",
      username: "update again",
    })

    expect(secondUpdate).toEqual({
      id: expect.any(String),
      email: "test@test.com",
      username: "update again",
      total_balance: "1000",
      hashed_password: expect.any(String),
    })
  })

  it("should not be possible to update user profile informations if email are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        username: "new username",
        total_balance: "1000",
      })
    }).rejects.toThrowError("Invalid e-mail profile.")
  })

  it("should not be possible to update user profile informations if email are not on database", async () => {
    await expect(() => {
      return sut.execute({
        email: "inexistent@inexistent.com",
        username: "new username",
        total_balance: "1000",
      })
    }).rejects.toThrowError("Invalid e-mail profile.")
  })
})
