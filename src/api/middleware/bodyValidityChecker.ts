import { NextFunction, Request, Response } from "express"

function bodyValidityChecker(req: Request, res: Response, next: NextFunction) {
  const bodyChecker = Object.keys(req.body)

  if (!bodyChecker.length) {
    return res.status(404).send({ message: "Invalid body." })
  }

  next()
}

export default bodyValidityChecker
