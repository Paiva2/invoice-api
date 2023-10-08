import { InvoiceSchema, ItemList } from "../../@types/types"
import { InvoiceRepository } from "../repositories/implementations/invoice-repositories"
import { randomUUID } from "node:crypto"

export default class InvoiceServicesMemory implements InvoiceRepository {
  private invoices: InvoiceSchema[] = []
  private itemList: ItemList[] = []

  async findUserInvoices(email: string) {
    const filterUserInvoices = this.invoices.filter(
      (invoice) => invoice.fkinvoiceowner === email
    )

    let formatUserInvoicesWithItemList: InvoiceSchema[] = []

    for (let invoice of filterUserInvoices) {
      formatUserInvoicesWithItemList.push({
        ...invoice,
        item_list: this.itemList.filter(
          (list) => list.fkitemlistowner === invoice.id
        ),
      })
    }

    return formatUserInvoicesWithItemList
  }

  async create(email: string, invoiceInfos: InvoiceSchema) {
    const {
      id,
      street_from,
      city_from,
      zipcode_from,
      country_from,
      name_to,
      email_to,
      street_to,
      city_to,
      zipcode_to,
      country_to,
      invoice_date,
      status,
      item_list,
    } = invoiceInfos

    const newInvoice = {
      id: id ? id : randomUUID(),
      street_from,
      city_from,
      zipcode_from,
      country_from,
      name_to,
      email_to,
      street_to,
      city_to,
      zipcode_to,
      country_to,
      invoice_date,
      status,
      fkinvoiceowner: email,
    }

    if (item_list) {
      for (let item of item_list) {
        item.fkitemlistowner = newInvoice.id
        item.total = Number(item.price) * Number(item.quantity)

        this.itemList.push(item)
      }
    }

    this.invoices.push(newInvoice)

    return {
      ...newInvoice,
      item_list,
    }
  }
}
