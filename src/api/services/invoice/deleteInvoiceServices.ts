import { InvoiceSchema, ItemList } from "../../../@types/types"
import { InvoiceRepository } from "../../repositories/implementations/invoice-repositories"

interface DeleteInvoiceServicesRequest {
  email: string
  invoiceId: string
}

type DeleteInvoiceResponseError = string

interface DeleteInvoiceServicesResponse {
  deleteInvoice: InvoiceSchema[] | Error | void
}

export default class DeleteInvoiceServices {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute({
    email,
    invoiceId,
  }: DeleteInvoiceServicesRequest): Promise<
    DeleteInvoiceServicesResponse | DeleteInvoiceResponseError
  > {
    if (!invoiceId) {
      throw new Error("Invalid invoice id.")
    } else if (!email) {
      throw new Error("Invalid e-mail.")
    }

    const checkIfInvoiceExists = await this.invoiceRepository.findInvoiceById(
      invoiceId
    )

    if (!checkIfInvoiceExists) {
      throw new Error("Invalid invoice id.")
    } else if (checkIfInvoiceExists.fkinvoiceowner !== email) {
      throw new Error("Not allowed.")
    }

    try {
      const deleteInvoice = await this.invoiceRepository.deleteUserInvoice(
        email,
        invoiceId
      )

      return { deleteInvoice }
    } catch (e) {
      const error = e as Error

      throw new Error(error.message)
    }
  }
}
