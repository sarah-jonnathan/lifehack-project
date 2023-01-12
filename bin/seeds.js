// bin/seeds.js

require("dotenv").config();
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
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270573/lifehack-project/xnmd8omdixegoikddt6c.jpg"
  },
  {
    name: "Food",
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270804/lifehack-project/cpbwm9a71rnoclih6bpc.jpg"
  },
  {
    name: "Cleaning",
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270648/lifehack-project/wgpnasbjgtwkvb52vktb.jpg"
  },
  {
    name: "DIY",
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270910/lifehack-project/kimfcxcdlszqpae5tq9k.jpg"
  },
  {
    name: "Animals",
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270693/lifehack-project/wadygvv9altdlncz08fu.jpg"
  },
  {
    name: "Tech",
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270863/lifehack-project/u95ybpipkferflutswuz.jpg"
  },
  {
    name: "Miscellaneous",
    img: "https://res.cloudinary.com/dsw3axyzs/image/upload/v1673270754/lifehack-project/inqnkeirb0vrrpfrdxwa.jpg"
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