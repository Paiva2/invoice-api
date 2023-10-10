import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import RegisterNewInvoiceServices from "../invoice/registerNewInvoiceServices"
import InvoiceServicesMemory from "../../in-memory/invoice-services-memory"
import DeleteInvoiceServices from "../invoice/deleteInvoiceServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let invoiceServicesMemory: InvoiceServicesMemory
let registerNewInvoiceServices: RegisterNewInvoiceServices
let sut: DeleteInvoiceServices
let newInvoiceId: string

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
  ],
}

describe("Delete invoice services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    invoiceServicesMemory = new InvoiceServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    registerNewInvoiceServices = new RegisterNewInvoiceServices(
      invoiceServicesMemory,
      userServicesMemory
    )

    sut = new DeleteInvoiceServices(invoiceServicesMemory)

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })

    const { newInvoice } = await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: "test@test.com",
      },
    })

    newInvoiceId = newInvoice.id!
  })

  it("should be possible to delete an existent invoice", async () => {
    const checkIfInvoiceExistsBeforeDelete =
      await invoiceServicesMemory.findInvoiceById(newInvoiceId!)

    expect(checkIfInvoiceExistsBeforeDelete).toEqual(
      expect.objectContaining({
        email_to: "emailto@email.com",
      })
    )

    await sut.execute({
      email: "test@test.com",
      invoiceId: newInvoiceId!,
    })

    const checkIfInvoiceExistsAfterDelete =
      await invoiceServicesMemory.findInvoiceById(newInvoiceId!)

    expect(checkIfInvoiceExistsAfterDelete).toBe(null)
  })

  it("should not be possible to delete an invoice if email are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "",
        invoiceId: newInvoiceId!,
      })
    }).rejects.toThrowError("Invalid e-mail.")
  })

  it("should not be possible to delete an invoice if invoice id are not provided", async () => {
    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        invoiceId: "",
      })
    }).rejects.toThrowError("Invalid invoice id.")
  })

  it("should not be possible to delete an invoice if invoice id is invalid", async () => {
    await expect(() => {
      return sut.execute({
        email: "test@test.com",
        invoiceId: "invalid/inexistent invoice id",
      })
    }).rejects.toThrowError("Invalid invoice id.")
  })
})
