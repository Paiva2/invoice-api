import { InvoiceSchema } from "../../../@types/types"

export interface InvoiceRepository {
  create(email: string, invoiceInfos: InvoiceSchema): Promise<InvoiceSchema>
  findUserInvoices(email: string): Promise<InvoiceSchema[]>
  updateInvoiceStatus(status: string, invoiceId: string): Promise<InvoiceSchema>
  findInvoiceById(invoiceId: string): Promise<InvoiceSchema | null>
}
