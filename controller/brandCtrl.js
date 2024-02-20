const Brand = require("../models/brandModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { StatusCodes } = require("http-status-codes");

const createBrand = asyncHandler(async (req, res) => {
  try {
    const newBrand = await Brand.create(req.body);
    res.status(StatusCodes.CREATED).json({brand:newBrand});
  } catch (error) {
    throw new Error(error);
  }
});
const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(StatusCodes.OK).json({brand:updatedBrand});
  } catch (error) {
    throw new Error(error);
  }
});
const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    await Brand.findByIdAndDelete(id);
    res.status(StatusCodes.OK).send();
  } catch (error) {
    throw new Error(error);
  }
});
const getBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaBrand = await Brand.findById(id);
    res.status(StatusCodes.OK).json({brand:getaBrand});
  } catch (error) {
    throw new Error(error);
  }
});
const getallBrand = asyncHandler(async (req, res) => {
  try {
    const getallBrand = await Brand.find();
    res.status(StatusCodes.OK).json({brands:getallBrand});
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBrand,
  updateBrand,
  deleteBrand,
  getBrand,
  getallBrand,
};
