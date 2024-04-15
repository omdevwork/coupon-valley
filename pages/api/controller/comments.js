const catchAsyncError = require("../middleware/catchAsyncError");
const Comment = require("../model/comments");
const Reply = require("../model/reply");
const ErrorHandler = require("../utils/ErrorHandler");

const addComment = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { comment, couponId, offerId } = req.body;

    const data = await Comment.create({
      comment,
      userId,
      couponId,
      offerId,
    });

    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

const addReply = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { reply, msgId } = req.body;
    const comment = await Comment.findById({ _id: msgId });
    if (!comment) {
      return next(new ErrorHandler(error.message, 400, res));
    }
    const data = await Reply.create({
      userId,
      reply,
      msgId: comment._id,
    });
    return res.status(200).json({ success: true, data: data });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

const getComment = catchAsyncError(async (req, res, next) => {
  try {
    const couponId = req.params.id;
    const data = await Comment.find({ couponId: couponId }).populate({
      path: "userId",
      select: "fullName",
    });

    const countMap = {};
    data?.forEach((item) => {
      countMap[item._id] = {
        _id: item._id,
      };
    });
    const msgIds = Object.values(countMap).map((item) => item._id);

    const countData = await Reply.find({ msgId: msgIds });

    return res.status(200).json({ success: true, data: { data, countData } });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

const getOfferComment = catchAsyncError(async (req, res, next) => {
  try {
    const offerId = req.params.id;
    const data = await Comment.find({ offerId: offerId }).populate({
      path: "userId",
      select: "fullName",
    });

    const countMap = {};
    data?.forEach((item) => {
      countMap[item._id] = {
        _id: item._id,
      };
    });
    const msgIds = Object.values(countMap).map((item) => item._id);

    const countData = await Reply.find({ msgId: msgIds });

    return res.status(200).json({ success: true, data: { data, countData } });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400, res));
  }
});

module.exports = { addComment, addReply, getComment, getOfferComment };
