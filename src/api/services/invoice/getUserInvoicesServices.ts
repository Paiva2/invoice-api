import { InvoiceSchema } from "../../../@types/types"
import { InvoiceRepository } from "../../repositories/implementations/invoice-repositories"

interface GetUserInvoicesRequest {
  email: string
}

interface GetUserInvoicesResponse {
  invoiceList: InvoiceSchema[]
}

export default class GetUserInvoicesServices {
  constructor(private invoiceRepository: InvoiceRepository) {}

  async execute({
    email,
  }: GetUserInvoicesRequest): Promise<GetUserInvoicesResponse> {
    if (!email) {
      throw new Error("Invalid e-mail.")
    }

    const invoiceList = await this.invoiceRepository.findUserInvoices(email)

    return { invoiceList }
  }
}
