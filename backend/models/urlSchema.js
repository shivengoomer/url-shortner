const { Mongoose, Schema, default: mongoose } = require("mongoose");
const User = require("./userSchema");
const urlSchema = new Schema(
  {
    shortId: {
      type: String,
      require: true,
      unique: true,
    },
    longUrl: {
      type: String,
      require: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    visitHistory: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("url", urlSchema);
