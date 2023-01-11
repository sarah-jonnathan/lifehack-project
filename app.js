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

// register a new custom helper for handlebars (now {{`equal` value1 value2}} returns true when value1==value2)
hbs.registerHelper('equal', function(value1, value2, options) {
    if(value1 && value2){
        
        if( value1.toString()===value2.toString() ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
});

// register a new custom helper for handlebars (now {{`equalOrTrue` value1 value2 value3}} returns true when value1==value2 or value3 is true)
hbs.registerHelper('equalOrTrue', function(value1, value2,value3, options) {
    if(value1 && value2 || value3){
        
        if( value3 || value1.toString()===value2.toString() ) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    }
});
//register a new custom helper to capitalize a string (the syntax to use it {{capitalize string1}}) where string1 is the value we want to capitalize
hbs.registerHelper('capitalize', function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  });

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
const getTags = require("./middleware/getTags")
const capitalize = require("./utils/capitalize");
const projectName = "Raccoons to the Rescue";

app.locals.appTitle = `${capitalize(projectName)}`;



// 👇 Start handling routes here

// store session
// getTags store all the tags in res.locals.tagsArray
app.use( getTags,(req, res, next) => {
    app.locals.userDetails = req.session.currentUser; //store user details in app.locals (so that is is available in handlebars)
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
