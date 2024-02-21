const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { cloudinaryUploadImg } = require("../utils/cloudinary");

const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const sneaker = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({ sneaker });
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }

    const Updatedsneaker = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    //if (!Updatedsneaker) throw new NotFoundError(`No Sneaker with id: ${id}`);
    res.status(StatusCodes.OK).json({ Updatedsneaker });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const id = req.params;
  validateMongoDbId(id);

  const deletedsneaker = await Product.findOneAndDelete(id);
  if (!deletedsneaker) throw new NotFoundError(`No Sneaker with id: ${id}`);
  res.status(StatusCodes.OK).send();
});

const getaProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  const sneaker = await Product.findById(id);
  if (!sneaker) throw new NotFoundError(`No Sneaker with id: ${id}`);
  res.status(StatusCodes.OK).json({ sneaker });
});

const getAllProduct = asyncHandler(async (req, res, next) => {
  try {
    // Filtering
    const { brand, fashion, target, color, priceRange } = req.query;
    const filterObj = {};

    if (brand) {
      filterObj.brand = brand;
    }

    if (fashion) {
      filterObj.fashionModel = fashion;
    }

    if (target) {
      filterObj.targetAudience = target;
    }

    if (color) {
      filterObj.color = color;
    }

    if (priceRange) {
      const operatorMap = {
        ">": "$gt",
        ">=": "$gte",
        "=": "$eq",
        "<": "$lt",
        "<=": "$lte",
      };
      const regEx = /\b(<|>|>=|=|<=)\b/g;
      let filters = priceRange.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );
      const options = ["price", "judgement"];
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");
        if (options.includes(field)) {
          filterObj["sneakerStores.price"] = { [operator]: Number(value) };
        }
      });
    }

    let query = Product.find(filterObj);

    // Sorting

    if (req.query.sort) {
      const sortOptions = {
        "price.lowToHigh": { "sneakerStores.price": 1 },
        "price.highToLow": { "sneakerStores.price": -1 },
        createdAt: { createdAt: -1 },
      };

      // Find products and apply sorting
      query = query.sort(sortOptions[req.query.sort]);
    }

    // limiting the fields
    const populateOptions = [];

    if (req.query.fields) {
      const fields = req.query.fields.split(",");

      if (fields.includes("brand")) {
        populateOptions.push({ path: "brand" });
      }

      if (fields.includes("fashionModel")) {
        populateOptions.push({ path: "fashionModel" });
      }

      if (fields.includes("targetAudience")) {
        populateOptions.push({ path: "targetAudience" });
      }

      if (fields.includes("color")) {
        populateOptions.push({ path: "color" });
      }

      if (fields.includes("sneakerStores.store")) {
        populateOptions.push({ path: "sneakerStores.store", model: "Store" });
      }

      if (fields.includes("sneakerStores.availableSizes")) {
        populateOptions.push({
          path: "sneakerStores.availableSizes",
          model: "Size",
        });
      }
    } else {
      populateOptions.push({ path: "brand" });
      populateOptions.push({ path: "fashionModel" });
      populateOptions.push({ path: "targetAudience" });
      populateOptions.push({ path: "color" });
      populateOptions.push({ path: "sneakerStores.store", model: "Store" });
      populateOptions.push({
        path: "sneakerStores.availableSizes",
        model: "Size",
      });
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // pagination
    const page = req.query.page;
    const limit = req.query.limit || 40;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount)
        throw new NotFoundError("This Page does not exists");
    }

    const sneakers = await query.populate(populateOptions);
    if (!sneakers.length) throw new NotFoundError("No sneakers found");
    res.status(StatusCodes.OK).json({ sneakers, count: sneakers.length });
  } catch (error) {
    next(error);
  }
});


module.exports = {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
 
};
