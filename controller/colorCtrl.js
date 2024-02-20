const Color = require("../models/colorModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { StatusCodes } = require("http-status-codes");

const createColor = asyncHandler(async (req, res) => {
  try {
    const newColor = await Color.create(req.body);
    res.status(StatusCodes.CREATED).json({color:newColor});
  } catch (error) {
    throw new Error(error);
  }
});
const updateColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const updatedColor = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(StatusCodes.OK).json({color:updatedColor});
  } catch (error) {
    throw new Error(error);
  }
});
const deleteColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    await Color.findByIdAndDelete(id);
    res.status(StatusCodes.OK).send();
  } catch (error) {
    throw new Error(error);
  }
});
const getColor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getaColor = await Color.findById(id);
    res.status(StatusCodes.OK).json({color:getaColor});
  } catch (error) {
    throw new Error(error);
  }
});
const getallColor = asyncHandler(async (req, res) => {
  try {
    const getallColor = await Color.find();
    res.status(StatusCodes.OK).json({color:getallColor, count:getallColor.length});
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createColor,
  updateColor,
  deleteColor,
  getColor,
  getallColor,
};
