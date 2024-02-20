const Product = require("../models/productModel");

const { NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");


const getsneakerResells = async(req, res)=>{
    const sneakers = await Product.find({ resell: true}).exec();
    if(!sneakers) throw new NotFoundError('No Sneakers found for resell');

    res.status(StatusCodes.OK).json({sneakers, count:sneakers.length});
}


module.exports = {getsneakerResells}