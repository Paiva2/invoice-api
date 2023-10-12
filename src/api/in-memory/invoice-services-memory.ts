import { InvoiceSchema, ItemList } from "../../@types/types"
import { InvoiceRepository } from "../repositories/implementations/invoice-repositories"
import { randomUUID } from "node:crypto"
import { generateRandomID } from "../utils/generateInvoiceId"

export default class InvoiceServicesMemory implements InvoiceRepository {
  private invoices: InvoiceSchema[] = []
  private itemList: ItemList[] = []

  async createItemListForInvoice(invoiceId: string, newItemList: ItemList[]) {
    const itensToKeep: string[] = []

    for (let item of newItemList) {
      if (item.id) {
        this.itemList = this.itemList.map((foundItem) => {
          if (foundItem.id === item.id) {
            const itemTotal = Number(item.price) * Number(item.quantity)

            const editItem = {
              ...item,
              fkitemlistowner: invoiceId,
              total: item.total || itemTotal,
            }

            foundItem = editItem
          }

          return foundItem
        })

        itensToKeep.push(item.id)
      } else {
        const createANewItem = {
          ...item,
          id: randomUUID(),
          fkitemlistowner: invoiceId,
          total: Number(item.price) * Number(item.quantity),
        }

        itensToKeep.push(createANewItem.id)
        this.itemList.push(createANewItem)
      }
    }

    this.itemList.forEach((item) => {
      if (
        !itensToKeep.includes(item.id!) &&
        item.fkitemlistowner === invoiceId
      ) {
        this.itemList = this.itemList.filter(
          (currentItem) => currentItem.id !== item.id
        )
      }
    })

    const getItemListOfThisInvoice = this.itemList.filter(
      (itens) => itens.fkitemlistowner === invoiceId
    )

    return getItemListOfThisInvoice
  }

  async updateInvoiceInformations(
    email: string,
    invoiceId: string,
    newData: InvoiceSchema
  ) {
    let invoiceToUpdate = this.invoices.find(
      (invoice) => invoice.id === invoiceId && invoice.fkinvoiceowner === email
    ) as InvoiceSchema

    const fieldsToUpdate = Object.keys(newData)
    const fieldsToNotUpdate = ["item_list", "invoiceId", "fkinvoiceowner", "id"]

    for (let field of fieldsToUpdate) {
      if (!fieldsToNotUpdate.includes(field)) {
        invoiceToUpdate = {
          ...invoiceToUpdate,
          [field]: newData[field as keyof typeof newData],
        }
      }
    }

    this.invoices = this.invoices.map((invoice) => {
      if (invoice.id === invoiceId && invoice.fkinvoiceowner === email) {
        invoice = invoiceToUpdate
      }

      return invoice
    })

    const getInvoiceUpdated = this.invoices.find(
      (invoice) => invoice.id === invoiceId && invoice.fkinvoiceowner === email
    ) as InvoiceSchema

    const updateInvoiceItemList = await this.createItemListForInvoice(
      invoiceId,
      newData.item_list
    )

    return { ...getInvoiceUpdated, item_list: updateInvoiceItemList }
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

    if (!findInvoice) return null

    const findInvoiceItemList = this.itemList.filter(
      (item) => item.fkitemlistowner === invoiceId
    )

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
      id: id ? id : generateRandomID(),
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

    const updateInvoiceItemList = await this.createItemListForInvoice(
      newInvoice.id,
      item_list
    )

    this.invoices.push(newInvoice)

    return {
      ...newInvoice,
      item_list: updateInvoiceItemList,
    }
  }
}
