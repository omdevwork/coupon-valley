const express = require("express");
const { isAuthincated } = require("../middleware/authincation");
const {
  addComment,
  addReply,
  getComment,
  getReply,
  getOfferComment,
} = require("../controller/comments");
const router = express.Router();

router.post("/addComment", isAuthincated, addComment);
router.post("/addReply", isAuthincated, addReply);
router.get("/getComment/:id", getComment);
router.get("/getOfferComment/:id", getOfferComment);
module.exports = router;
