import { InvoiceSchema, ItemList, User } from "../../../@types/types"
import { InvoiceRepository } from "../../repositories/implementations/invoice-repositories"
import { UserRepository } from "../../repositories/implementations/user-repositories"

interface UpdateInvoiceStatusServicesRequest {
  newStatus: "pending" | "paid" | "draft"
  invoiceId: string
  userEmail: string
}

type UpdateInvoiceStatusServicesResponse = {
  updatedInvoice: InvoiceSchema
}

export default class UpdateInvoiceStatusServices {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private userRepository: UserRepository
  ) {}

  async execute({
    newStatus,
    invoiceId,
    userEmail,
  }: UpdateInvoiceStatusServicesRequest): Promise<UpdateInvoiceStatusServicesResponse> {
    if (!userEmail) {
      throw new Error(
        "Invalid user e-mail. You must provide an valid e-mail to update status."
      )
    }

    if (!invoiceId) {
      throw new Error(
        "Invalid invoice id. You must provide an valid invoice id to update status."
      )
    }

    const checkIfInvoiceExists = await this.invoiceRepository.findInvoiceById(
      invoiceId
    )

    if (!checkIfInvoiceExists) {
      throw new Error("Invoice not found.")
    }

    if (checkIfInvoiceExists.status === "paid" && newStatus === "paid") {
      throw new Error("This invoice is already paid.")
    }

    const updatedInvoice = await this.invoiceRepository.updateInvoiceStatus(
      newStatus,
      invoiceId
    )

    if (newStatus === "paid") {
      const getUserInformations = (await this.userRepository.findUnique(
        userEmail
      )) as User

      if (!getUserInformations.total_balance) return { updatedInvoice }

      const getInvoiceTotalValue: number =
        checkIfInvoiceExists.item_list.reduce(
          (acc: number, invoice: ItemList) => {
            return (acc += Number(invoice.total))
          },
          0
        )

      await this.userRepository.updateUserProfileInformations({
        email: userEmail,
        total_balance: String(
          Number(getUserInformations.total_balance) - getInvoiceTotalValue
        ),
      })
    }

    return { updatedInvoice }
  }
}
