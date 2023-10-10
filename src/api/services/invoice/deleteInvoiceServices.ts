import { InvoiceSchema, ItemList } from "../../../@types/types"
import { InvoiceRepository } from "../../repositories/implementations/invoice-repositories"

interface DeleteInvoiceServicesRequest {
  email: string
  invoiceId: string
}

type DeleteInvoiceResponseError = string

interface DeleteInvoiceServicesResponse {
  deleteInvoice: InvoiceSchema[] | Error
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
    }

    const checkIfInvoiceExists = await this.invoiceRepository.findInvoiceById(
      invoiceId
    )

    if (!checkIfInvoiceExists) {
      throw new Error("Invalid invoice id.")
    }

    if (!email) {
      throw new Error("Invalid e-mail.")
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
