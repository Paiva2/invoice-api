import { Express } from "express"
import InvoiceControllers from "../controllers/invoice/invoiceControllers"
import bodyValidityChecker from "../middleware/bodyValidityChecker"
import jwtSignChecker from "../middleware/jwtSignChecker"

const invoiceControllers = new InvoiceControllers()

export default function invoiceRoutes(app: Express) {
  app.post(
    "/invoice",
    [bodyValidityChecker, jwtSignChecker],
    invoiceControllers.registerNewInvoiceController
  )

  app.get(
    "/invoice",
    [jwtSignChecker],
    invoiceControllers.getAllUserInvoicesController
  )

  app.patch(
    "/invoice",
    [jwtSignChecker, bodyValidityChecker],
    invoiceControllers.updateInvoiceStatusController
  )
}
