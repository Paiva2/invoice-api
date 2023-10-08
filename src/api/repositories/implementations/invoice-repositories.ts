import { InvoiceSchema } from "../../../@types/types"

export interface InvoiceRepository {
  create(id: string, invoiceInfos: InvoiceSchema): Promise<InvoiceSchema>
}
