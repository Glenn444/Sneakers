const targetAudience = require("../models/targetAudience");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");


const createtargetAudience = asyncHandler(async (req, res) => {
  try {
    const target = await targetAudience.create(req.body);
    res.status(StatusCodes.CREATED).json({target});
  } catch (error) {
    throw new Error(error);
  }
});
const updatetargetAudience = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

    const updatedtarget = await targetAudience.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedtarget) throw new NotFoundError(`No Target Audience with id: ${id}`);
    res.status(StatusCodes.OK).json({updatedtarget});
});
const deletetargetAudience = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const deletedtarget = await targetAudience.findByIdAndDelete(id);

    if (!deletedtarget) throw new NotFoundError(`No Target Audience with id: ${id}`);
    res.status(StatusCodes.OK).send();
});
const gettargetAudience = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const target = await targetAudience.findById(id);
    if (!target) throw new NotFoundError(`No Target Audience with id: ${id}`);
    res.status(StatusCodes.OK).json({target});
});
const getalltargetAudiences = asyncHandler(async (req, res) => {
  try {
    const target = await targetAudience.find();
    res.status(StatusCodes.OK).json({target, count:target.length});
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createtargetAudience,
  updatetargetAudience,
  deletetargetAudience,
  gettargetAudience,
  getalltargetAudiences,
};
