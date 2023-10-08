import { InvoiceSchema } from "../../../@types/types"

export interface InvoiceRepository {
  create(email: string, invoiceInfos: InvoiceSchema): Promise<InvoiceSchema>
}
