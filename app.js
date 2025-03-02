const express = require("express");
require("express-async-errors");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const storeLocals = require("./middleware/storeLocals");
const passport = require("passport");
const passportInit = require("./passport/passportInit");
const secretWordRoutes = require("./routes/secretWord");
const auth = require("./middleware/auth");


require("dotenv").config(); // Load environment variables from .env

const app = express();
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));

// MongoDB session store
const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});

// Session setup
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(session(sessionParms));
app.use(flash());

// Initialize Passport
passportInit(); // Run the passport initialization to register strategies
app.use(passport.initialize());
app.use(passport.session()); // Ensure session support for passport


// Use the storeLocals middleware globally for all routes
app.use(storeLocals);

// Use the routes for /secretWord
app.use("/secretWord", auth, secretWordRoutes);


// // Routes for secretWord
// app.post("/secretWord", (req, res) => {
//   if (req.body.secretWord.toUpperCase()[0] === "P") {
//     req.flash("error", "That word won't work!");
//     req.flash("error", "You can't use words that start with p.");
//   } else {
//     req.session.secretWord = req.body.secretWord;
//     req.flash("info", "The secret word was changed.");
//   }

//   res.render("secretWord", {
//     secretWord: req.session.secretWord,
//     errors: req.flash("error"),
//     info: req.flash("info"),
//   });
// });

// app.get("/secretWord", (req, res) => {
//   if (!req.session.secretWord) {
//     req.session.secretWord = "syzygy";
//   }

//   res.render("secretWord", {
//     secretWord: req.session.secretWord,
//     errors: req.flash("error"),
//     info: req.flash("info"),
//   });
// });

// 404 page handler
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
  // Connect to the database
  await require("./db/connect")(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log("Error connecting to the database:", error);
  }
};

start();
