const User = require("../models/userModel");

const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../errors");
require('dotenv').config();

const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");


// Create a User ----------------------------------------------

const createUser = asyncHandler(async (req, res) => {

  const email = req.body.email;
 
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    if (req.body.role) req.body.role = "user";
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new NotFoundError("User Already Exists");
  }
});


// admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if (findAdmin.role !== "admin") throw new UnauthenticatedError("Not Authorised.You are not an admin");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.status(StatusCodes.OK).json({
      _id: findAdmin?._id,
      Username: findAdmin?.username,
      email: findAdmin?.email,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new UnauthenticatedError("Invalid Credentials");
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new UnauthenticatedError("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new UnauthenticatedError(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new UnauthenticatedError("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.status(StatusCodes.OK).json({ accessToken });
  });
});

// logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new UnauthenticatedError("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    throw new UnauthenticatedError('Not Allowed'); // forbidden
  }
 
  await User.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.status(StatusCodes.OK).json({msg:'Logged out Successfully'}) 
});

// Update a user

const updatedUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        username: req?.body?.username,
        email: req?.body?.email,
      },
      {
        new: true,
      }
    );
    if (!updatedUser) throw new NotFoundError(`No User with id: ${_id}`);
    res.status(StatusCodes.OK).json({updatedUser});
  } catch (error) {
    throw new Error(error);
  }
});


// Get all users

const getallUser = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.status(StatusCodes.OK).json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single user

const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

    const user1 = await User.findById(id);
    if (!user1) throw new NotFoundError(`No User with id: ${id}`);
    res.status(StatusCodes.OK).json({
      user1,
    });
 
});

// Get a single user

const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) throw new NotFoundError(`No User with id: ${id}`);
    res.status(StatusCodes.OK).send();
    
});


const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.status(StatusCodes.OK).json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new NotFoundError("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const hostingUrl = process.env.HOSTING_URL;
    const resetURL = `${hostingUrl}/api/user/reset-password/${token}`;
    const emailContent = `Hi, Please follow this link to reset Your Password. This link is valid for 10 minutes. <a href='${resetURL}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: emailContent,
    };
    sendEmail(data);
    res.status(StatusCodes.OK).json({token});
  } catch (error) {
    throw new Error(error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new BadRequestError(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(StatusCodes.OK).json(user);
});

module.exports = {
  createUser,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
 
};
