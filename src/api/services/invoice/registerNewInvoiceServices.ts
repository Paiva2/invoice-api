import { InvoiceSchema, User } from "../../../@types/types"
import { InvoiceRepository } from "../../repositories/implementations/invoice-repositories"
import { UserRepository } from "../../repositories/implementations/user-repositories"

interface RegisterNewInvoiceRequest {
  email: string
  invoiceInfos: InvoiceSchema
}

interface RegisterNewInvoiceResponse {
  newInvoice: InvoiceSchema
}

export default class RegisterNewInvoiceServices {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    email,
    invoiceInfos,
  }: RegisterNewInvoiceRequest): Promise<RegisterNewInvoiceResponse> {
    if (!invoiceInfos?.item_list?.length) {
      throw new Error(
        "Invalid item list. An invoice should have at least one item."
      )
    }

    if (!email) {
      throw new Error("Invalid e-mail profile.")
    }

    const findUser = (await this.userRepository.findUnique(email)) as User

    if (!findUser) {
      throw new Error("User not found.")
    }

    const newInvoice = await this.invoiceRepository.create(
      String(findUser.email),
      invoiceInfos
    )

    return { newInvoice }
  }
}
