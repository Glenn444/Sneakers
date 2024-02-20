const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require('express-async-handler');
const {UnauthenticatedError} = require('../errors');
require('dotenv').config();

const authMiddleware = asyncHandler( async (req, res, next)=>{
    let token;
    if (req?.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        console.log(token);
        try {

            if (token){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded?.id);
                req.user = user;
                next();
            }
        } catch (error) {
            throw new UnauthenticatedError("Not Authorised token expired, Please login again");
        }
    }else{
        throw new UnauthenticatedError('There is no token attached to the header');
    }
});

const isAdmin = asyncHandler(async (req, res, next)=>{
    const {email} = req?.user;
    const adminUser = await User.findOne({email});
    if (adminUser.role !== 'admin'){
        throw new UnauthenticatedError("You are not an admin");
    }else{
        next();
    }
})
module.exports = {authMiddleware, isAdmin}