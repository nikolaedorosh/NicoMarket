const authRouter = require("express").Router();
const { authenticated } = require("../middleware/mid");
const {
  userLogin,
  userLoginRender,
  userRegisterRender,
  userRegister,
  userLogout,
} = require("../controller/authController");

//login router
authRouter.route("/login").get(userLoginRender).post(userLogin);

//register router
authRouter.route("/register").get(userRegisterRender).post(userRegister);
//logout router
authRouter.route("/logout").get(userLogout);

module.exports = authRouter;
