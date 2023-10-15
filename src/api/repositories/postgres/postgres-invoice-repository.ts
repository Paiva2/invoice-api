import { QueryResult } from "pg"
import { InvoiceSchema, ItemList } from "../../../@types/types"
import pool from "../../../pgclient"
import { InvoiceRepository } from "../implementations/invoice-repositories"
import { randomUUID } from "node:crypto"
import { generateRandomID } from "../../utils/generateInvoiceId"

export default class PostgresInvoiceRepository implements InvoiceRepository {
  async createItemListForInvoice(invoiceId: string, newItemList: ItemList[]) {
    let invoiceItemList: ItemList[] = []
    let itensToKeep: string[] = []
    const createIdForItem = newItemList.map((item) => {
      if (!item.id) {
        item.id = randomUUID()
      }

      return item
    })

    for (let value of createIdForItem) {
      let itemList = await pool
        .query<ItemList>(
          `
          INSERT INTO item_list 
            (item_name, quantity, price, id, fkitemlistowner)
          VALUES 
            ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE 
          SET 
            item_name = $1, 
            quantity = $2, 
            price = $3
          RETURNING *
        `,
          [value.item_name, value.quantity, value.price, value.id, invoiceId]
        )
        .catch(async () => await pool.query("ROLLBACK"))

      invoiceItemList.push(itemList.rows[0])
      itensToKeep.push(`'${value.id}'` as string)
    }

    await pool.query(
      `
        DELETE FROM item_list 
        WHERE fkitemlistowner = $1 
        AND 
        id not in (${itensToKeep.toString()})
    `,
      [invoiceId]
    )

    return invoiceItemList
  }

  async findInvoiceItemList(invoiceId: string) {
    const getItemList = await pool.query(
      "SELECT * FROM item_list where fkitemlistowner = $1",
      [invoiceId]
    )

    return getItemList.rows
  }

  async updateInvoiceInformations(
    email: string,
    invoiceId: string,
    newData: InvoiceSchema
  ) {
    const fieldsToNotUpdate = ["item_list", "invoiceId", "fkinvoiceowner", "id"]
    const invoiceFieldsToUpdate = Object.keys(newData)

    let newValues: string[] = []
    let values: string[] = []

    invoiceFieldsToUpdate.forEach((field, index) => {
      if (!fieldsToNotUpdate.includes(field)) {
        newValues.push(`${field} = $${index}`)

        values.push(newData[field as keyof typeof newData])
      }
    })

    values = [...values, invoiceId, email]

    const invoiceIdFromValues = values.length - 1
    const fkInvoiceOwnerFromValues = values.length

    const updatedInvoice = await pool.query<InvoiceSchema>(
      ` UPDATE invoice 
        SET ${newValues} 
        WHERE id = $${invoiceIdFromValues}
        AND fkinvoiceowner = $${fkInvoiceOwnerFromValues}
      `,
      [...values]
    )

    const updateInvoiceItemList = await this.createItemListForInvoice(
      invoiceId,
      newData.item_list
    )

    return { ...updatedInvoice.rows[0], item_list: updateInvoiceItemList }
  }

  async deleteUserInvoice(email: string, invoiceId: string) {
    await pool.query<InvoiceSchema>(
      `
      DELETE FROM invoice WHERE id = $1 AND fkinvoiceowner = $2 RETURNING *
    `,
      [invoiceId, email]
    )
  }

  async findInvoiceById(invoiceId: string) {
    const findInvoice = await pool.query<InvoiceSchema>(
      "SELECT * FROM invoice where id = $1",
      [invoiceId]
    )

    if (!findInvoice.rows.length) return null

    const findInvoicesItemList = await pool.query<ItemList>(
      "SELECT * from item_list WHERE fkitemlistowner = $1",
      [findInvoice.rows[0].id]
    )

    const invoiceFormatted = {
      ...findInvoice.rows[0],
      item_list: findInvoicesItemList.rows,
    }

    return invoiceFormatted
  }

  async updateInvoiceStatus(status: string, invoiceId: string) {
    const updatedInvoice = await pool.query<InvoiceSchema>(
      "UPDATE invoice SET status = $1 WHERE id = $2 RETURNING *",
      [status, invoiceId]
    )

    return updatedInvoice.rows[0]
  }

  async create(email: string, invoiceInfos: InvoiceSchema) {
    const {
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
      item_list,
      status,
    } = invoiceInfos

    await pool.query("BEGIN;")

    const newInvoice = await pool.query(
      `
        INSERT INTO invoice (
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
            fkinvoiceowner,
            id
        )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *;
      `,
      [
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
        invoice_date ?? new Date(),
        status ? status : "pending",
        email,
        generateRandomID(),
      ]
    )

    await pool.query("COMMIT;")

    const getThisInvoiceItemList = await this.createItemListForInvoice(
      newInvoice.rows[0].id,
      item_list
    )

    await pool.query("END;")

    return {
      ...newInvoice.rows[0],
      item_list: getThisInvoiceItemList,
    }
  }

  async findUserInvoices(email: string) {
    let formattedInvoicesWithItemList: InvoiceSchema[] = []

    const invoiceRows = await pool.query<InvoiceSchema>(
      `
      SELECT * from invoice WHERE fkinvoiceowner = $1
    `,
      [email]
    )

    for (let invoice of invoiceRows.rows) {
      const invoiceItemList = await pool.query<ItemList>(
        `
        SELECT * from item_list WHERE fkitemlistowner = $1
      `,
        [invoice.id]
      )

      formattedInvoicesWithItemList.push({
        ...invoice,
        item_list: invoiceItemList.rows,
      })
    }

    return formattedInvoicesWithItemList
  }
}
