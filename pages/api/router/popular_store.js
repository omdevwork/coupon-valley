const express = require("express");
const { isAuthincated } = require("../middleware/authincation");
const { createPopularStore, getPopularStore } = require("../controller/popular_store");
const router = express.Router();

router.post("/createPopularstore", isAuthincated, createPopularStore);
router.get("/getPopularstore", getPopularStore);

module.exports = router;
