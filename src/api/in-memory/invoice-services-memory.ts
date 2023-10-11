import { InvoiceSchema, ItemList } from "../../@types/types"
import { InvoiceRepository } from "../repositories/implementations/invoice-repositories"
import { randomUUID } from "node:crypto"

export default class InvoiceServicesMemory implements InvoiceRepository {
  private invoices: InvoiceSchema[] = []
  private itemList: ItemList[] = []

  async updateInvoiceInformations(
    email: string,
    invoiceId: string,
    newData: InvoiceSchema
  ) {
    this.itemList = this.itemList.filter(
      (item) => item.fkitemlistowner !== invoiceId
    )

    for (let list of newData.item_list) {
      await this.createItemListForInvoice(invoiceId, [list], list.id)
    }

    const updateInvoice = this.invoices.map((invoice) => {
      if (invoice.id === invoiceId && invoice.fkinvoiceowner === email) {
        invoice = {
          ...newData,
          id: invoiceId,
          fkinvoiceowner: email,
        }
      }

      return invoice
    })

    this.invoices = updateInvoice

    const getItemListOfThisInvoice = await this.findInvoiceItemList(invoiceId)

    const getInvoiceUpdated = this.invoices.find(
      (invoice) => invoice.id === invoiceId
    ) as InvoiceSchema

    return {
      ...getInvoiceUpdated,
      item_list: getItemListOfThisInvoice,
    }
  }

  async createItemListForInvoice(
    invoiceId: string,
    newItemList: ItemList[],
    itemListId?: string
  ) {
    for (let item of newItemList) {
      item.id = itemListId ? itemListId : randomUUID()
      item.fkitemlistowner = invoiceId
      item.total = Number(item.price) * Number(item.quantity)

      this.itemList.push(item)
    }
  }

  async findInvoiceItemList(invoiceId: string) {
    return this.itemList.filter((item) => {
      return item.fkitemlistowner === invoiceId
    })
  }

  async deleteUserInvoice(email: string, invoiceId: string) {
    const checkIfInvoiceIsValid = this.invoices.some((invoice) => {
      return invoice.id === invoiceId && invoice.fkinvoiceowner === email
    })

    if (!checkIfInvoiceIsValid) {
      throw new Error("Invalid invoice or e-mail.")
    }

    const updatedInvoiceList = this.invoices.filter((invoice) => {
      return invoice.id !== invoiceId && invoice.fkinvoiceowner === email
    })

    const updateItemList = this.itemList.filter((itemList) => {
      return itemList.fkitemlistowner !== invoiceId
    })

    this.invoices = updatedInvoiceList
    this.itemList = updateItemList

    return this.invoices
  }

  async findInvoiceById(invoiceId: string) {
    const findInvoice = this.invoices.find(
      (invoice) => invoice.id === invoiceId
    )
    const findInvoiceItemList = this.itemList.filter(
      (item) => item.fkitemlistowner === invoiceId
    )

    if (!findInvoice) return null

    const invoice = {
      ...findInvoice,
      item_list: findInvoiceItemList,
    }

    return invoice
  }

  async updateInvoiceStatus(newStatus: string, invoiceId: string) {
    let updatedInvoice = {} as InvoiceSchema

    const updateInvoices = this.invoices.map((invoice) => {
      if (invoice.id === invoiceId) {
        if (newStatus) {
          invoice.status = newStatus
        }

        updatedInvoice = invoice
      }

      return invoice
    })

    this.invoices = updateInvoices

    return updatedInvoice
  }

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
      status: status ? status : "pending",
      fkinvoiceowner: email,
    }

    await this.createItemListForInvoice(newInvoice.id, item_list)

    this.invoices.push(newInvoice)

    return {
      ...newInvoice,
      item_list,
    }
  }
}
