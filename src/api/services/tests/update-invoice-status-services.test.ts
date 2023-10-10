import { describe, it, expect, beforeEach } from "vitest"
import UserRegisterServices from "../user/userRegisterServices"
import UserServicesMemory from "../../in-memory/users-services-memory"
import RegisterNewInvoiceServices from "../invoice/registerNewInvoiceServices"
import InvoiceServicesMemory from "../../in-memory/invoice-services-memory"
import UpdateInvoiceStatusServices from "../invoice/updateInvoiceStatusServices"
import GetUserProfileServices from "../user/getUserProfileServices"
import UpdateUserProfileServices from "../user/updateUserProfileServices"

let userRegisterServices: UserRegisterServices
let userServicesMemory: UserServicesMemory
let invoiceServicesMemory: InvoiceServicesMemory
let registerNewInvoiceServices: RegisterNewInvoiceServices
let getUserProfileServices: GetUserProfileServices
let updateUserProfileServices: UpdateUserProfileServices
let sut: UpdateInvoiceStatusServices

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

describe("Update invoice status services", () => {
  beforeEach(async () => {
    userServicesMemory = new UserServicesMemory()
    invoiceServicesMemory = new InvoiceServicesMemory()

    userRegisterServices = new UserRegisterServices(userServicesMemory)
    registerNewInvoiceServices = new RegisterNewInvoiceServices(
      invoiceServicesMemory,
      userServicesMemory
    )
    getUserProfileServices = new GetUserProfileServices(userServicesMemory)
    updateUserProfileServices = new UpdateUserProfileServices(
      userServicesMemory
    )

    sut = new UpdateInvoiceStatusServices(
      invoiceServicesMemory,
      userServicesMemory
    )

    await userRegisterServices.execute({
      email: "test@test.com",
      username: "user test",
      password: "123456",
    })

    await updateUserProfileServices.execute({
      email: "test@test.com",
      total_balance: "200",
    })
  })

  it("should be possible to update an existing invoice status", async () => {
    const { newInvoice } = await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: "test@test.com",
      },
    })

    const { updatedInvoice } = await sut.execute({
      invoiceId: newInvoice.id as string,
      newStatus: "draft",
      userEmail: "test@test.com",
    })

    expect(updatedInvoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: "draft",
      })
    )
  })

  it("should update user total balance if new status is paid", async () => {
    const { newInvoice } = await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: "test@test.com",
      },
    })

    const { updatedInvoice } = await sut.execute({
      invoiceId: newInvoice.id as string,
      newStatus: "paid",
      userEmail: "test@test.com",
    })

    const { findUserProfile } = await getUserProfileServices.execute({
      email: "test@test.com",
    })

    expect(updatedInvoice).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        status: "paid",
      })
    )

    expect(findUserProfile.total_balance).toBe("0")

    // retest with other value and new invoice

    const { newInvoice: secondNewInvoice } =
      await registerNewInvoiceServices.execute({
        email: "test@test.com",
        invoiceInfos: {
          ...invoiceModel,
          fkinvoiceowner: "test@test.com",
          item_list: [
            {
              item_name: "expensive item",
              price: "1800",
              quantity: "1",
            },
          ],
        },
      })

    await updateUserProfileServices.execute({
      email: "test@test.com",
      total_balance: "2000",
    })

    await sut.execute({
      invoiceId: secondNewInvoice.id as string,
      newStatus: "paid",
      userEmail: "test@test.com",
    })

    const { findUserProfile: findUserProfileOnRetest } =
      await getUserProfileServices.execute({
        email: "test@test.com",
      })

    expect(findUserProfileOnRetest.total_balance).toBe("200")
  })

  it("should not be possible to update invoice status if invoice id are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: "",
        newStatus: "paid",
        userEmail: "test@test.com",
      })
    }).rejects.toThrowError(
      "Invalid invoice id. You must provide an valid invoice id to update status."
    )
  })

  it("should not be possible to update invoice status if user e-mail are not provided.", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: "any id",
        newStatus: "paid",
        userEmail: "",
      })
    }).rejects.toThrowError(
      "Invalid user e-mail. You must provide an valid e-mail to update status."
    )
  })

  it("should not be possible to update invoice status if invoice id are not valid.", async () => {
    await expect(() => {
      return sut.execute({
        invoiceId: "inexistent invoice id",
        newStatus: "paid",
        userEmail: "test@test.com",
      })
    }).rejects.toThrowError("Invoice not found.")
  })

  it("should not be possible to update invoice status to paid if that invoice is already paid.", async () => {
    const { newInvoice } = await registerNewInvoiceServices.execute({
      email: "test@test.com",
      invoiceInfos: {
        ...invoiceModel,
        fkinvoiceowner: "test@test.com",
      },
    })

    await sut.execute({
      invoiceId: newInvoice.id as string,
      newStatus: "paid",
      userEmail: "test@test.com",
    })

    await expect(() => {
      return sut.execute({
        invoiceId: newInvoice.id as string,
        newStatus: "paid",
        userEmail: "test@test.com",
      })
    }).rejects.toThrowError("This invoice is already paid.")
  })
})
