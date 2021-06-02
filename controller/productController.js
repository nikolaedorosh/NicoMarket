const Product = require("../models/productModel");

//render homepage
const homepageRender = async (req, res) => {
  const products = await Product.mostRecent();
  res.render("homepage", { products });
};

//receive products from form and put in db
const showProducts = async (req, res) => {
  const { name, description, price, amount, imgUrl } = req.body;
  const currentUser = req.session.user.id;
  try {
    const product = await Product.create({
      name,
      description,
      price,
      amount,
      imgUrl,
      seller: currentUser,
    });
  } catch (error) {
    return res.render("homepage", {
      message: "Make sure your title and text is unique!!",
    });
  }
  res.redirect("/homepage");
};

module.exports = { homepageRender, showProducts };
