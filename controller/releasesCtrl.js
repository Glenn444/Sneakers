const Product = require("../models/productModel");


const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");

const getAllReleases = async (req, res, next) => {
  function calculateRemainingTime(releaseDate) {
    const currentDateTime = new Date();
    const releaseDateTime = new Date(releaseDate);
    const remainingMilliseconds = releaseDateTime - currentDateTime;

    if (remainingMilliseconds <= 0) {
      return releaseDateTime.toLocaleDateString(); 
    }

    const remainingMonths = Math.floor(
      remainingMilliseconds / (1000 * 60 * 60 * 24 * 30)
    );
    const remainingWeeks = Math.floor(
      remainingMilliseconds / (1000 * 60 * 60 * 24 * 7)
    );
    const remainingDays = Math.floor(
      remainingMilliseconds / (1000 * 60 * 60 * 24)
    );
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));

    let remainingTime = "";
    if (remainingMonths > 0) {
      remainingTime += `in ${remainingMonths} month${
        remainingMonths > 1 ? "s" : ""
      }`;
    } else if (remainingWeeks > 0) {
      remainingTime += `in ${remainingWeeks} week${
        remainingWeeks > 1 ? "s" : ""
      }`;
    } else if (remainingDays > 0) {
      remainingTime += `in ${remainingDays} day${remainingDays > 1 ? "s" : ""}`;
    } else if (remainingHours > 0) {
      remainingTime += `in ${remainingHours} hour${
        remainingHours > 1 ? "s" : ""
      }`;
    } else {
      remainingTime = "Now";
    }

    return remainingTime;
  }


  const currentDate = new Date();

  try {

    const validReleases = await Product.find({
      releaseDate: { $gte: currentDate },
    }).lean();
    if(!validReleases) throw new NotFoundError('No Sneakers were found awaiting releasing');
    const sneakers = validReleases.map((product) => {
      const remainingTime = calculateRemainingTime(product.releaseDate);
      return { ...product, remainingTime };
    });

    res.status(StatusCodes.OK).json({sneakers, count:sneakers.length});
  } catch (error) {
    
    next(error);
  }
};

module.exports = {getAllReleases}