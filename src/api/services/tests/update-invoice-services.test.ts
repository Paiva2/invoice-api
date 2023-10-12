import { beforeEach, describe, expect, it } from "vitest"
import { InvoiceSchema } from "../../../@types/types"
import InvoiceServicesMemory from "../../in-memory/invoice-services-memory"
import UserServicesMemory from "../../in-memory/users-services-memory"
import EditInvoiceServices from "../invoice/EditInvoiceServices"
import RegisterNewInvoiceServices from "../invoice/registerNewInvoiceServices"
import UserRegisterServices from "../user/userRegisterServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let invoiceServicesMemory: InvoiceServicesMemory
let registerNewInvoiceServices: RegisterNewInvoiceServices
let sut: EditInvoiceServices

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
      item_name: "item 1",
      price: "200",
      quantity: "1",
    },
  ],
}

let createdInvoice = {} as InvoiceSchema

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

    const { newInvoice } = await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: "test@test.com",
      },
    })

    createdInvoice = newInvoice
  })

  it("should be possible to update an existing invoice", async () => {
    const { editedInvoice } = await sut.execute({
      invoiceId: createdInvoice.id!,
      userEmail: "test@test.com",
      newData: {
        ...invoiceModel,
        name_to: "update the name",
        city_to: "update the city",
        country_from: "update the country",
        item_list: [
          {
            id: createdInvoice.item_list[0].id,
            item_name: "update item 1",
            price: "2000",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
            total: 4000,
          },
          {
            item_name: "add one more item",
            price: "100",
            quantity: "1",
            fkitemlistowner: createdInvoice.id!,
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
            id: editedInvoice.item_list[0].id,
            item_name: "update item 1",
            price: "2000",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
            total: 4000,
          },
          {
            id: editedInvoice.item_list[1].id,
            item_name: "add one more item",
            price: "100",
            quantity: "1",
            fkitemlistowner: createdInvoice.id!,
            total: 100,
          },
        ],
      })
    )

    const { editedInvoice: editAgain } = await sut.execute({
      invoiceId: createdInvoice.id!,
      userEmail: "test@test.com",
      newData: {
        ...invoiceModel,
        name_to: "update with new item list",
        city_to: "update with new item list",
        country_from: "update with new item list",
        item_list: [
          {
            id: editedInvoice.item_list[1].id,
            item_name: "edit existent item",
            price: "600",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
          },
          {
            item_name: "totally new item",
            price: "10000",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
          },
          {
            item_name: "totally new item 2",
            price: "400",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
          },
        ],
      },
    })

    expect(editAgain).toEqual(
      expect.objectContaining({
        ...invoiceModel,
        name_to: "update with new item list",
        city_to: "update with new item list",
        country_from: "update with new item list",
        item_list: [
          {
            id: editAgain.item_list[0].id,
            item_name: "edit existent item",
            price: "600",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
            total: 1200,
          },
          {
            id: editAgain.item_list[1].id,
            item_name: "totally new item",
            price: "10000",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
            total: 20000,
          },
          {
            id: editAgain.item_list[2].id,
            item_name: "totally new item 2",
            price: "400",
            quantity: "2",
            fkitemlistowner: createdInvoice.id!,
            total: 800,
          },
        ],
      })
    )
  })

  it("should not be possible to update an invoice if email are not provided", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: createdInvoice.id!,
        userEmail: "",
        newData: {
          ...invoiceModel,
          name_to: "update the name",
          city_to: "update the city",
          country_from: "update the country",
          item_list: [
            {
              id: createdInvoice.item_list[0].id,
              item_name: "update item 1",
              price: "2000",
              quantity: "2",
              fkitemlistowner: createdInvoice.id!,
              total: 4000,
            },
          ],
        },
      })
    }).rejects.toThrowError("Invalid user e-mail.")
  })

  it("should not be possible to update an invoice if invoice are not provided", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: "",
        userEmail: "test@test.com",
        newData: {
          ...invoiceModel,
          name_to: "update the name",
          city_to: "update the city",
          country_from: "update the country",
          item_list: [
            {
              id: createdInvoice.item_list[0].id,
              item_name: "update item 1",
              price: "2000",
              quantity: "2",
              fkitemlistowner: createdInvoice.id!,
              total: 4000,
            },
          ],
        },
      })
    }).rejects.toThrowError("Invalid invoice id.")
  })

  it("should not be possible to update an invoice if new data are not provided", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: createdInvoice.id!,
        userEmail: "test@test.com",
        newData: {} as InvoiceSchema,
      })
    }).rejects.toThrowError("Invalid invoice informations.")
  })

  it("should not be possible to update an invoice if invoice doesnt exists", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: "inexistent invoice",
        userEmail: "test@test.com",
        newData: {
          ...invoiceModel,
          name_to: "update the name",
          city_to: "update the city",
          country_from: "update the country",
          item_list: [
            {
              id: createdInvoice.item_list[0].id,
              item_name: "update item 1",
              price: "2000",
              quantity: "2",
              fkitemlistowner: "inexistent invoice",
              total: 4000,
            },
          ],
        },
      })
    }).rejects.toThrowError("Invoice not found.")
  })

  it("should not be possible to update an invoice if user dont own this invoice", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: createdInvoice.id!,
        userEmail: "differentuser@user.com",
        newData: {
          ...invoiceModel,
          name_to: "update the name",
          city_to: "update the city",
          country_from: "update the country",
          item_list: [
            {
              id: createdInvoice.item_list[0].id,
              item_name: "update item 1",
              price: "2000",
              quantity: "2",
              fkitemlistowner: createdInvoice.id!,
              total: 4000,
            },
          ],
        },
      })
    }).rejects.toThrowError("Invalid invoice id.")
  })
})
