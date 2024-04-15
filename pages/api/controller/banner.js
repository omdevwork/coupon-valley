const catchAsyncError = require("../middleware/catchAsyncError");
const Banner = require("../model/banner");
const user = require("../model/user");
const ErrorHandler = require("../utils/ErrorHandler");
const { unlinkFile } = require("../utils/unlinkFile");
const path = require("path");

const createBanner = catchAsyncError(async (req, res, next) => {
  try {
    var { bannerImage } = req.files;
    var bannerImage = bannerImage ? bannerImage[0]?.filename : undefined;
    const { merchantId, link } = req.body;
    const userId = req.user._id;
    const userData = await user.findById(userId);
    if (userData.role === "admin") {
      const data = await Banner.create({
        bannerImage,
        merchantId,
        link,
      });
      return res.status(200).json({
        success: true,
        data: data,
        message: "Banner created successfully.",
      });
    } else {
      return next(new ErrorHandler("only admin can create banner", 401, res));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

const getBanner = catchAsyncError(async (req, res, next) => {
  try {
    const data = await Banner.find().populate("merchantId");
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

const updateBanner = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const { bannerImage } = req.files;
    const newBannerImage = bannerImage ? bannerImage[0]?.filename : undefined;
    const { merchantId, link } = req.body;
    const data = await Banner.findOne({ _id: id });
    if (newBannerImage && data.bannerImage) {
      try {
        await unlinkFile(path.join("./public/uploads", data.bannerImage));
      } catch (unlinkErr) {
        console.error(unlinkErr);
      }
    }
    const updateData = await Banner.findByIdAndUpdate(
      id,
      {
        bannerImage: newBannerImage,
        merchantId,
        link,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json({
      success: true,
      data: updateData,
      message: "Banner has been updated",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
    s;
  }
});

const deleteBanner = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await Banner.findByIdAndDelete({ _id: id });
    if (!data) {
      return next(new ErrorHandler("No data found", 400, res));
    }

    if (data.bannerImage) {
      try {
        await unlinkFile(path.join("./public/uploads", data.bannerImage));
      } catch (unlinkErr) {
        console.error(unlinkErr);
      }
    }
    return res
      .status(200)
      .json({ success: true, message: "Banner has been deleted" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

module.exports = { createBanner, getBanner, updateBanner, deleteBanner };
