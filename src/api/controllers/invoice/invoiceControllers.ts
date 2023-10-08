import { Request, Response } from "express"
import PostgresInvoiceRepository from "../../repositories/postgres/postgres-invoice-repository"
import PostgresUsersRepository from "../../repositories/postgres/postgres-users-repository"
import RegisterNewInvoiceServices from "../../services/invoice/registerNewInvoiceServices"
import retrieveJwt from "../../utils/retrieveJwt"
import GetUserInvoicesServices from "../../services/invoice/getUserInvoicesServices"

const postgresInvoiceRepository = new PostgresInvoiceRepository()
const postgresUsersRepository = new PostgresUsersRepository()
export default class InvoiceControllers {
  async registerNewInvoiceController(request: Request, response: Response) {
    const {
      city_from,
      country_from,
      street_from,
      zipcode_from,
      city_to,
      country_to,
      email_to,
      name_to,
      street_to,
      zipcode_to,
      fkinvoiceowner,
      invoice_date,
      status,
      item_list,
    } = request.body
    const getJwtFromCookies = request.cookies["invoice-auth"]

    const userEmail = retrieveJwt(getJwtFromCookies)

    const registerNewInvoiceServices = new RegisterNewInvoiceServices(
      postgresInvoiceRepository,
      postgresUsersRepository
    )

    try {
      await registerNewInvoiceServices.execute({
        email: userEmail.email,
        invoiceInfos: {
          city_from,
          country_from,
          street_from,
          zipcode_from,
          city_to,
          country_to,
          email_to,
          name_to,
          street_to,
          zipcode_to,
          fkinvoiceowner,
          invoice_date,
          status,
          item_list,
        },
      })

      return response.status(201).send()
    } catch (e) {
      if (e instanceof Error) {
        return response.status(403).send({ message: e.message })
      }
    }
  }

  async getAllUserInvoices(request: Request, response: Response) {
    const getAuthToken = request.cookies["invoice-auth"]

    const getUserJwt = retrieveJwt(getAuthToken)

    const getUserInvoicesServices = new GetUserInvoicesServices(
      postgresInvoiceRepository
    )

    try {
      const { invoiceList } = await getUserInvoicesServices.execute({
        email: getUserJwt.email,
      })

      return response.status(200).send({ data: invoiceList })
    } catch (e) {
      if (e instanceof Error) {
        return response.status(403).send({ message: e.message })
      }
    }
  }
}
