import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import RegisterNewInvoiceServices from "../invoice/registerNewInvoiceServices"
import InvoiceServicesMemory from "../../in-memory/invoice-services-memory"
import UserLoginServices from "../user/userLoginServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let invoiceServicesMemory: InvoiceServicesMemory
let userLoginServices: UserLoginServices
let sut: RegisterNewInvoiceServices

const invoiceModel = {
  city_from: "city from",
  country_from: "country from",
  street_from: "street from",
  zipcode_from: "zipcode from",
  city_to: "city to",
  country_to: "country to",
  email_to: "emailto@email.com",
  name_to: "name to",
  street_to: "street to",
  zipcode_to: "zipcode to",
  fkinvoiceowner: "",
  invoice_date: new Date().toString(),
  status: "pending",
  item_list: [
    {
      item_name: "item 1",
      price: "200",
      quantity: "1",
    },
    {
      item_name: "item 2",
      price: "300",
      quantity: "2",
    },
  ],
}

describe("Register new invoice Services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    invoiceServicesMemory = new InvoiceServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    userLoginServices = new UserLoginServices(userServicesMemory)
    sut = new RegisterNewInvoiceServices(
      invoiceServicesMemory,
      userServicesMemory
    )

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to create a new invoice", async () => {
    const { findUser: authUser } = await userLoginServices.execute({
      email: "test@test.com",
      password: "123456",
    })

    const { newInvoice } = await sut.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: authUser.email.toString(),
      },
    })

    expect(newInvoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        fkinvoiceowner: authUser.email,
        status: "pending",
        item_list: expect.arrayContaining([
          {
            id: expect.any(String),
            item_name: "item 1",
            price: "200",
            quantity: "1",
            fkitemlistowner: newInvoice.id,
            total: 200,
          },
          {
            id: expect.any(String),
            item_name: "item 2",
            price: "300",
            quantity: "2",
            fkitemlistowner: newInvoice.id,
            total: 600,
          },
        ]),
      })
    )
  })

  it("should not be possible to create a new invoice if item list are empty", async () => {
    const { findUser: authUser } = await userLoginServices.execute({
      email: "test@test.com",
      password: "123456",
    })

    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        invoiceInfos: {
          ...invoiceModel,
          fkinvoiceowner: authUser.email.toString(),
          item_list: [],
        },
      })
    }).rejects.toThrowError(
      "Invalid item list. An invoice should have at least one item."
    )
  })

  it("should not be possible to create a new invoice if email profile are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "",
        invoiceInfos: {
          ...invoiceModel,
        },
      })
    }).rejects.toThrowError("Invalid e-mail profile.")
  })

  it("should not be possible to create a new invoice if email profile are not on database", async () => {
    await expect(() => {
      return sut.execute({
        email: "inexistent@inexistent.com.br",
        invoiceInfos: {
          ...invoiceModel,
        },
      })
    }).rejects.toThrowError("User not found.")
  })
})
