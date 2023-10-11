import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import RegisterNewInvoiceServices from "../invoice/registerNewInvoiceServices"
import InvoiceServicesMemory from "../../in-memory/invoice-services-memory"
import EditInvoiceServices from "../invoice/EditInvoiceServices"
import { randomUUID } from "node:crypto"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let invoiceServicesMemory: InvoiceServicesMemory
let registerNewInvoiceServices: RegisterNewInvoiceServices
let sut: EditInvoiceServices
let newInvoiceId = ""

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
  fkinvoiceowner: "test@test.com",
  invoice_date: new Date().toString(),
  status: "pending",
  item_list: [
    {
      id: "1",
      item_name: "item 1",
      price: "200",
      quantity: "1",
    },
  ],
}

describe("Update invoice services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    invoiceServicesMemory = new InvoiceServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    registerNewInvoiceServices = new RegisterNewInvoiceServices(
      invoiceServicesMemory,
      userServicesMemory
    )

    sut = new EditInvoiceServices(invoiceServicesMemory)

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })
  })

  it("should be possible to update an existing invoice", async () => {
    const { newInvoice } = await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: "test@test.com",
      },
    })

    const { editedInvoice } = await sut.execute({
      invoiceId: newInvoice.id!,
      userEmail: "test@test.com",
      newData: {
        ...invoiceModel,
        name_to: "update the name",
        city_to: "update the city",
        country_from: "update the country",
        item_list: [
          {
            id: newInvoice.item_list[0].id,
            item_name: "update item 1",
            price: "2000",
            quantity: "2",
            fkitemlistowner: newInvoice.id!,
          },
          {
            id: "2",
            item_name: "add one more item",
            price: "100",
            quantity: "1",
            fkitemlistowner: newInvoice.id!,
          },
        ],
      },
    })

    expect(editedInvoice).toEqual(
      expect.objectContaining({
        ...invoiceModel,
        name_to: "update the name",
        city_to: "update the city",
        country_from: "update the country",
        item_list: [
          {
            id: newInvoice.item_list[0].id,
            item_name: "update item 1",
            price: "2000",
            quantity: "2",
            fkitemlistowner: newInvoice.id!,
            total: 4000,
          },
          {
            id: editedInvoice.item_list[1].id,
            item_name: "add one more item",
            price: "100",
            quantity: "1",
            fkitemlistowner: newInvoice.id!,
            total: 100,
          },
        ],
      })
    )

    const { editedInvoice: editAgain } = await sut.execute({
      invoiceId: newInvoice.id!,
      userEmail: "test@test.com",
      newData: {
        ...invoiceModel,
        name_to: "update the name again",
        city_to: "update the city again",
        country_from: "update the country again",
        item_list: [
          {
            id: "3",
            item_name: "new item again 1",
            price: "10000",
            quantity: "2",
            fkitemlistowner: newInvoice.id!,
            total: 20000,
          },
          {
            id: "4",
            item_name: "new item again 2",
            price: "4000",
            quantity: "2",
            fkitemlistowner: newInvoice.id!,
            total: 8000,
          },
        ],
      },
    })

    expect(editAgain).toEqual(
      expect.objectContaining({
        ...invoiceModel,
        name_to: "update the name again",
        city_to: "update the city again",
        country_from: "update the country again",
        item_list: [
          {
            id: "3",
            item_name: "new item again 1",
            price: "10000",
            quantity: "2",
            fkitemlistowner: newInvoice.id!,
            total: 20000,
          },
          {
            id: "4",
            item_name: "new item again 2",
            price: "4000",
            quantity: "2",
            fkitemlistowner: newInvoice.id!,
            total: 8000,
          },
        ],
      })
    )
  })
})
