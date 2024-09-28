import { StatusCodes } from 'http-status-codes'
export const errorHandlingMiddleware = (err, req, res, next) => {

  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode],
    // stack: err.stack
  }
  console.error(responseError)

  res.status(responseError.statusCode).json(responseError)
}