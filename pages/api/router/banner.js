const express = require("express");
const { isAuthincated } = require("../middleware/authincation");
const {
  createBanner,
  getBanner,
  updateBanner,
  deleteBanner,
} = require("../controller/banner");
const upload = require("../utils/multer");
const router = express.Router();

const uploadFields = upload.fields([{ name: "bannerImage", maxCount: 1 }]);

router.post("/createBanner", isAuthincated, uploadFields, createBanner);
router.get("/getBanner", getBanner);
router.put("/updateBanner/:id", isAuthincated, uploadFields, updateBanner);
router.delete("/deleteBanner/:id", isAuthincated, deleteBanner);

module.exports = router;
