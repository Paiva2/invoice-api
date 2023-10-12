import { InvoiceSchema } from "../../../@types/types"
import { InvoiceRepository } from "../../repositories/implementations/invoice-repositories"

interface EditInvoiceServicesRequest {
  invoiceId: string
  userEmail: string
  newData: InvoiceSchema
}

interface EditInvoiceServicesResponse {
  editedInvoice: InvoiceSchema
}

export default class EditInvoiceServices {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute({
    invoiceId,
    newData,
    userEmail,
  }: EditInvoiceServicesRequest): Promise<EditInvoiceServicesResponse> {
    if (!userEmail) {
      throw new Error("Invalid user e-mail.")
    } else if (!invoiceId) {
      throw new Error("Invalid invoice id.")
    } else if (!newData || !Object.keys(newData).length) {
      throw new Error("Invalid invoice informations.")
    }

    const checkIfUserHasThisInvoice =
      await this.invoiceRepository.findInvoiceById(invoiceId)

    if (!checkIfUserHasThisInvoice) {
      throw new Error("Invoice not found.")
    } else if (checkIfUserHasThisInvoice?.fkinvoiceowner !== userEmail) {
      throw new Error("Invalid invoice id.")
    }

    const editedInvoice =
      await this.invoiceRepository.updateInvoiceInformations(
        userEmail,
        invoiceId,
        newData
      )

    return { editedInvoice }
  }
}
