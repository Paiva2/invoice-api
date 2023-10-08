import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import RegisterNewInvoiceServices from "../invoice/registerNewInvoiceServices"
import InvoiceServicesMemory from "../../in-memory/invoice-services-memory"
import UserLoginServices from "../user/userLoginServices"
import GetUserInvoicesServices from "../invoice/getUserInvoicesServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let invoiceServicesMemory: InvoiceServicesMemory
let userLoginServices: UserLoginServices
let registerNewInvoiceServices: RegisterNewInvoiceServices
let sut: GetUserInvoicesServices

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

const secondInvoiceModel = {
  ...invoiceModel,
  email_to: "alternativeemail@email.com",
  item_list: [
    {
      item_name: "any item",
      price: "100",
      quantity: "10",
    },
  ],
}

describe("Get user invoices services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    invoiceServicesMemory = new InvoiceServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    userLoginServices = new UserLoginServices(userServicesMemory)

    registerNewInvoiceServices = new RegisterNewInvoiceServices(
      invoiceServicesMemory,
      userServicesMemory
    )

    sut = new GetUserInvoicesServices(invoiceServicesMemory)

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })

    const { findUser: authUser } = await userLoginServices.execute({
      email: "test@test.com",
      password: "123456",
    })

    await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: authUser.email.toString(),
      },
    })

    await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...secondInvoiceModel,
        fkinvoiceowner: authUser.email.toString(),
      },
    })
  })

  it("should be possible to get user invoices", async () => {
    const { invoiceList } = await sut.execute({
      email: "test@test.com",
    })

    expect(invoiceList).toHaveLength(2)
    expect(invoiceList).toEqual([
      expect.objectContaining({
        email_to: "emailto@email.com",
        item_list: [
          expect.objectContaining({ item_name: "item 1", total: 200 }),
          expect.objectContaining({ item_name: "item 2", total: 600 }),
        ],
      }),
      expect.objectContaining({
        email_to: "alternativeemail@email.com",
        item_list: [
          expect.objectContaining({ item_name: "any item", total: 1000 }),
        ],
      }),
    ])
  })

  it("should not be possible to get user invoices if email somehow are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "",
      })
    }).rejects.toThrowError("Invalid e-mail.")
  })
})
