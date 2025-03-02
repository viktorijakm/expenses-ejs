
const storeLocals = (req, res, next) => {
    // Store the logged-in user in res.locals
    if (req.user) {
      res.locals.user = req.user;  // If there's a logged-in user, store user in res.locals
    } else {
      res.locals.user = null;  // Otherwise, set it to null
    }
  
    // Store flash messages in res.locals
    res.locals.info = req.flash("info");
    res.locals.errors = req.flash("error");
  
    next(); // Proceed to the next middleware or route handler
  };
  
  module.exports = storeLocals;
  