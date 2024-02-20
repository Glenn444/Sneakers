const Size = require("../models/sizeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");


const createSize = asyncHandler(async (req, res) => {
  try {
    const size = await Size.create(req.body);
    res.status(StatusCodes.CREATED).json({size});
  } catch (error) {
    throw new Error(error);
  }
});
const updateSize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

    const updatedSize = await Size.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedSize) throw new NotFoundError(`No Size with id: ${id}`);
    res.status(StatusCodes.OK).json({updatedSize});
});
const deleteSize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const deletedSize = await Size.findByIdAndDelete(id);

    if (!deletedSize) throw new NotFoundError(`No Size with id: ${id}`);
    res.status(StatusCodes.OK).json({deletedSize});
});
const getSize = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const size = await Size.findById(id);
    if (!size) throw new NotFoundError(`No Size with id: ${id}`);
    res.status(StatusCodes.OK).json({size});
});
const getallSizes = asyncHandler(async (req, res) => {
  try {
    const sizes = await Size.find();
    res.status(StatusCodes.OK).json({sizes, count:sizes.length});
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createSize,
  updateSize,
  deleteSize,
  getSize,
  getallSizes,
};
