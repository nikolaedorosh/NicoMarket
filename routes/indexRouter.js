const router = require("express").Router();
const Product = require("../models/productModel");

//show products without doing authorisation
router.get("/", async (req, res) => {
  const products = await Product.mostRecent();
  res.render("index", { products });
});

module.exports = router;
