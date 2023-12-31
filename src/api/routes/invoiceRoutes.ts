import { Express } from "express"
import InvoiceControllers from "../controllers/invoice/invoiceControllers"
import jwtSignChecker from "../middleware/jwtSignChecker"
import bodySchemaChecker from "../middleware/bodySchemaChecker"
import {
  deleteUserInvoiceSchema,
  registerNewInvoiceSchema,
  updateInvoiceSchema,
  updateInvoiceStatusSchema,
} from "../schemas/invoice/invoiceSchemas"

const invoiceControllers = new InvoiceControllers()

export default function invoiceRoutes(app: Express) {
  app.post(
    "/invoice",
    [jwtSignChecker, bodySchemaChecker(registerNewInvoiceSchema)],
    invoiceControllers.registerNewInvoiceController
  )

  app.get(
    "/invoice",
    [jwtSignChecker],
    invoiceControllers.getAllUserInvoicesController
  )

  app.patch(
    "/invoice",
    [jwtSignChecker, bodySchemaChecker(updateInvoiceStatusSchema)],
    invoiceControllers.updateInvoiceStatusController
  )

  app.delete(
    "/invoice",
    [jwtSignChecker, bodySchemaChecker(deleteUserInvoiceSchema)],
    invoiceControllers.deleteInvoiceController
  )

  app.patch(
    "/update-invoice",
    [jwtSignChecker, bodySchemaChecker(updateInvoiceSchema)],
    invoiceControllers.updateInvoiceInformationsController
  )
}
