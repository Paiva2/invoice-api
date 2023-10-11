import { InvoiceSchema, ItemList } from "../../../@types/types"

export interface InvoiceRepository {
  create(email: string, invoiceInfos: InvoiceSchema): Promise<InvoiceSchema>
  findUserInvoices(email: string): Promise<InvoiceSchema[]>
  deleteUserInvoice(
    email: string,
    invoiceId: string
  ): Promise<InvoiceSchema[] | Error>
  updateInvoiceStatus(status: string, invoiceId: string): Promise<InvoiceSchema>
  findInvoiceById(invoiceId: string): Promise<InvoiceSchema | null>
  updateInvoiceInformations(
    email: string,
    invoiceId: string,
    newData: InvoiceSchema
  ): Promise<InvoiceSchema>
  createItemListForInvoice(invoiceId: string, newItemList: ItemList[]): void
  findInvoiceItemList(invoiceId: string): Promise<ItemList[]>
}
