// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
const getTags = require("./middleware/getTags")
const capitalize = require("./utils/capitalize");
const projectName = "Raccoons to the Rescue";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher and edited by Jonnathan and Sarah`;

// 👇 Start handling routes here
// store session and get baseURL for links across the website
app.use( getTags,(req, res, next) => {
    app.locals.userDetails = req.session.currentUser; //store user details in app.locals (so that is is available in handlebars)
    // get baseURL
    app.locals.baseURL = req.protocol + "://" + req.hostname + ":" + process.env.PORT;
    next();
});

//index routes
app.use("/", require("./routes/index.routes"));

//auth routes
app.use("/", require("./routes/auth.routes"));

// lifehack routes
app.use("/", require("./routes/lifehack.routes"))

// tag routes
app.use("/", require("./routes/tag.routes"))

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
