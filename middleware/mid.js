function authenticated(req, res, next) {
  if (res.locals.id) {
    return next();
  }
  return res.redirect("/homepage");
}

module.exports = { authenticated };
