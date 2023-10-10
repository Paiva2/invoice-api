import { NextFunction, Request, Response } from "express"
import { ZodError, AnyZodObject } from "zod"

const bodySchemaChecker = (schemaToValidate: AnyZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schemaToValidate.parse(req.body)

      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(409).send({
          message: e.errors.map((error) => {
            return `${error.message}: ${error.path}`
          }),
        })
      }
    }
  }
}

export default bodySchemaChecker
