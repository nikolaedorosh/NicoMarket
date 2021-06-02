const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRound = 10;

//render login
const userLoginRender = (req, res) => {
  res.render("login");
};
//render registration
const userRegisterRender = (req, res) => {
  res.render("register");
};

//receive registration form
const userRegister = async (req, res) => {
  const { email, name, password: passNew } = req.body;
  console.log(email, name, passNew);
  if (email && name && passNew) {
    const password = await bcrypt.hash(passNew, saltRound);
    const user = await User.create({ name, email, password });

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return res.redirect("/homepage");
  }
  return res.redirect("/auth/register");
};
//receive login form
const userLogin = async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const currentUser = await User.findOne({ email });
    if (currentUser && (await bcrypt.compare(password, currentUser.password))) {
      req.session.user = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
      };
      return res.redirect("/homepage");
    }
    return res
      .status(418)
      .send("Could not sign in!! Please insert correct email and password");
  }
  return res.status(418).redirect("/auth/login");
};

//logout
const userLogout = (req, res) => {
  req.session.destroy();
  res.clearCookie("sid");
  return res.redirect("/");
};

module.exports = {
  userLoginRender,
  userLogin,
  userRegisterRender,
  userRegister,
  userLogout,
};
