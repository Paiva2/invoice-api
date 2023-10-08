import { QueryResult } from "pg"
import { InvoiceSchema, ItemList } from "../../../@types/types"
import pool from "../../../pgclient"
import { InvoiceRepository } from "../implementations/invoice-repositories"

export default class PostgresInvoiceRepository implements InvoiceRepository {
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
            fkinvoiceowner
        )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
        invoice_date,
        "pending",
        email,
      ]
    )

    let getThisInvoiceItemList = []

    if (item_list) {
      for (let item of item_list) {
        const createdItemList = await pool.query(
          `
              INSERT INTO item_list (item_name, quantity, price, fkitemlistowner)
              VALUES ($1, $2, $3, $4)
              RETURNING *;
            `,
          [item.item_name, item.quantity, item.price, newInvoice.rows[0].id]
        )

        getThisInvoiceItemList.push(createdItemList.rows[0])
      }
    }

    await pool.query("COMMIT;")

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
      const invoiceItemList = await pool.query<ItemList[]>(
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
