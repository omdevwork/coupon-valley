const catchAsyncError = require("../middleware/catchAsyncError");
const Popular_store = require("../model/popular_store");
const user = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");

const createPopularStore = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userData = await user.findOne(userId);
    if (userData.role === "admin") {
      const data = await Popular_store.findOneAndUpdate(
        { userId: userId },
        req.body,
        { new: true, upsert: true }
      );
      return res.status(200).json({
        success: true,
        data: data,
        message: "popular store has been create",
      });
    } else {
      return next(new ErrorHandler("Only admin can add popular store"));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

const getPopularStore = catchAsyncError(async (req, res, next) => {
  try {
    const data = await Popular_store.find({}).populate({
      path: "merchantData.merchant",
      model: "merchantmodel",
    });
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

module.exports = { createPopularStore, getPopularStore };
