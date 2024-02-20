const Product = require("../models/productModel");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");


const searchCtrl = async (req, res, next) => {
  const searchQuery = req.query.search;
  try {
    let query = Product.find()
      .lean()
      .populate("brand")
      .populate("fashionModel")
      .populate("targetAudience")
      .populate({
        path: "color",
        select: "title",
      });

    const searchWords = searchQuery.trim().split(" ");

    const searchConditions = searchWords.map((word) => ({
      $or: [
        { "brand.title": { $regex: new RegExp(word, "i") } },
        { title: { $regex: new RegExp(word, "i") } },
      ],
    }));
    
    query.or(searchConditions);

    const sneakers = await query;

    if (!sneakers.length) {
      throw new NotFoundError(
        `No Sneakers found with name or brand: ${searchQuery}`
      );
    }

    res.status(StatusCodes.OK).json({ sneakers, count: sneakers.length });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchCtrl };
