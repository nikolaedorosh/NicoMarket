const User = require("../models/userModel");

//render cart
const shoppingCartRender = async (req, res) => {
  const userCart = await User.findById(req.params.id).populate("cart");
  res.render("cart");
};

//add product to the users cart
const addToCart = async (req, res) => {
  const productId = req.params.id;
  console.log(res.locals.id);
  console.log(productId);
  try {
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

module.exports = { shoppingCartRender, addToCart };
