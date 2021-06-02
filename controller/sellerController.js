const Product = require("../models/productModel");

//render sellerPage
const myProductsRender = async (req, res) => {
  const currentUser = req.session.user.id;
  const products = await Product.find({ seller: `${currentUser}` });
  res.render("myProducts", { products });
};

//delete
const deleting = async (req, res) => {
  let product;
  try {
    product = await Product.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(418);
  }
};

//edit render
const editProductRender = async (req, res) => {
  const thisProd = await Product.findById(req.params.id);
  res.render("editProd", { thisProd });
};

//edit patch
const editProduct = async (req, res) => {
  console.log(req.body);
  let product;
  try {
    product = await Product.findByIdAndUpdate(req.params.id, { ...req.body });
    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  myProductsRender,
  deleting,
  editProductRender,
  editProduct,
};
