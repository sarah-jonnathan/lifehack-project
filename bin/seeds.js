// bin/seeds.js
const mongoose = require('mongoose');
const Tags = require('../models/Tag.model');

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lifehack-project" || "mongodb://localhost/lifehack-project" || "mongodb://localhost:27017/lifehack-project";

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((error) => {
    console.error("Error connecting to mongo: ", error);
  });

const tags = [
  {
    name: "Parenting",
    img: ["./images/tags/parenting01.jpg"]
  },
  {
    name: "Food",
    img: ["./images/tags/food01.jpg"]
  },
  {
    name: "Cleaning",
    img: ["./images/tags/cleaning01.jpg"]
  },
  {
    name: "DIY",
    img: ["./images/tags/diy01.jpg"]
  },
  {
    name: "Animals",
    img: ["./images/tags/animals01.jpg"]
  },
  {
    name: "Tech",
    img: ["./images/tags/tech01.jpg"]
  },
  {
    name: "Miscellaneous",
    img: ["./images/tags/misc01.jpg"]
  }
];


const tagsPromise = Tags.create(tags);

Promise.all([tagsPromise])
  .then( (result) => {
    const tagsCreated = result[0];
    console.log(`Number of tags created... ${tagsCreated.length} `)

    // Once created, close the DB connection
    mongoose.connection.close();

  })
  .catch( error => console.log("error seeding data in DB....", error));