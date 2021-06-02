const homepageRouter = require("express").Router();
const {
  homepageRender,
  showProducts,
} = require("../controller/productController");
const {
  shoppingCartRender,
  addToCart,
  //showMyCart,
} = require("../controller/shoppingCartController");
const {
  myProductsRender,
  deleting,
  editProductRender,
  editProduct,
} = require("../controller/sellerController");

//render homepage
homepageRouter.route("/").get(homepageRender).post(showProducts);

//render shoping cart
homepageRouter.route("/cart/:id").get(shoppingCartRender);

//add product to the users cart
homepageRouter.route("/addToCart/:id").get(addToCart);

//render my products for sale
homepageRouter.route("/myProducts").get(myProductsRender);

//delete prod
homepageRouter.route("/:id").delete(deleting);

//edit prod
homepageRouter.route("/edit/:id").get(editProductRender).put(editProduct);

module.exports = homepageRouter;
