import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import GetUserProfileServices from "../user/getUserProfileServices"
import UserLoginServices from "../user/userLoginServices"

let userServicesMemory: UserServicesMemory

let userRegisterServices: UserRegisterServices
let userLoginServices: UserLoginServices
let sut: GetUserProfileServices

describe("Get User profile services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    userLoginServices = new UserLoginServices(userServicesMemory)
    sut = new GetUserProfileServices(userServicesMemory)

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to get an existent user profile", async () => {
    const { findUser } = await userLoginServices.execute({
      email: "test@test.com",
      password: "123456",
    })

    const { findUserProfile } = await sut.execute({
      email: findUser.email,
    })

    expect(findUserProfile).toEqual(
      expect.objectContaining({
        id: findUser.id,
        hashed_password: findUser.hashed_password,
        email: findUser.email,
        username: findUser.username,
      })
    )
  })

  it("should not be possible to get an existent user profile if email are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "",
      })
    }).rejects.toThrowError("You must provide an valid e-mail.")
  })

  it("should not be possible to get an existent user profile if email are not on database", async () => {
    await expect(() => {
      return sut.execute({
        email: "inexistent@inexistent.com",
      })
    }).rejects.toThrowError("User profile not found.")
  })
})
