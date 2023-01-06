const { Schema, model,default:mongoose } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const lifehackSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true, //bonus => is not required if we have embedMultimedia
      trim: true,
    },
    embedMultimedia: [{
      type: String,
      trim: true,
      //bonus => let the user put more than one url
      // bonus =>validate an URL
      

    }],
    likes: {
      type: Number, //bonus make it an array of users
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // check if we can store only the username
      ref: "User",
    },

    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tags", //
      //bonus make it required
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Lifehack = model("Lifehack", lifehackSchema);

module.exports = Lifehack;
