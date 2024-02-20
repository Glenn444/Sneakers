const FashionModel = require("../models/fashionModel");
const asyncHandler = require("express-async-handler");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const validateMongoDbId = require("../utils/validateMongodbId");

const createfashionModel = asyncHandler(async (req, res) => {
  try {
    const fashionModel = await FashionModel.create(req.body);
    res.status(StatusCodes.CREATED).json({fashionModel});
  } catch (error) {
    throw new Error(error);
  }
});
const updatefashionModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
 
    const updatedfashionModel = await FashionModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedfashionModel) throw new NotFoundError(`No Fashion Model with id: ${id}`);
    res.status(StatusCodes.OK).json({updatedfashionModel});

});
const deletefashionModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
 
    const deletedfashionModel = await FashionModel.findByIdAndDelete(id);
    if (!deletedfashionModel) throw new NotFoundError(`No Fashion Model with id: ${id}`);
    res.status(StatusCodes.OK).send();

});
const getfashionModel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
 
    const fashionModel = await FashionModel.findById(id);
    if (!fashionModel) throw new NotFoundError(`No Fashion Model with id: ${id}`);
    res.status(StatusCodes.OK).json({fashionModel});
 
});
const getallFashionModels = asyncHandler(async (req, res) => {
  try {
    const fashionModels = await FashionModel.find();
    res.status(StatusCodes.OK).json({fashionModels});
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createfashionModel,
  updatefashionModel,
  deletefashionModel,
  getfashionModel,
  getallFashionModels,
};
