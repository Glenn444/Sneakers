const Store = require("../models/storeModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");


const createStore = asyncHandler(async (req, res) => {
  try {
    const newStore = await Store.create(req.body);
    res.status(StatusCodes.CREATED).json({newStore});
  } catch (error) {
    throw new Error(error);
  }
});
const updateStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

    const updatedStore = await Store.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedStore) throw new NotFoundError(`No Store with id: ${id}`);
    res.status(StatusCodes.OK).json({updatedStore});
});
const deleteStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const deletedStore = await Store.findByIdAndDelete(id);

    if (!deletedStore) throw new NotFoundError(`No Store with id: ${id}`);
    res.status(StatusCodes.OK).json({deletedStore});
});
const getStore = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
    const store = await Store.findById(id);
    if (!store) throw new NotFoundError(`No Store with id: ${id}`);
    res.status(StatusCodes.OK).json({store});
});
const getallStores = asyncHandler(async (req, res) => {
  try {
    const stores = await Store.find();
    res.status(StatusCodes.OK).json({stores, count:stores.length});
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createStore,
  updateStore,
  deleteStore,
  getStore,
  getallStores,
};
