const { Schema, model,default:mongoose } = require("mongoose");


const commentSchema = new Schema(
  {
    commentParent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    commentText: {
      type: String,
      required: true, 
      trim: true,
    },
  
    
    commentAuthor: {
      type: mongoose.Schema.Types.ObjectId, // check if we can store only the username
      required:true,
      ref: "User",
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
