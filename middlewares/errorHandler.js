const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

let customError = {
  //set default
  statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg:err.message || 'Something Went Wrong try again latter'
}

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (err.name === 'ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=> item.message).join(',');
    customError.statusCode = 400;
  }
  if (err.message.includes('duplicate key error')) {
    const duplicateField = err.message.match(/index: ([\w.]+)/)[1];
    customError.msg = `Duplicate value entered for ${duplicateField}, please choose another value`;
    customError.statusCode = 400;
  }
  if(err.name === 'CastError'){
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND
  }
  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware
