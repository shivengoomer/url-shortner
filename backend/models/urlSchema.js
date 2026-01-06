const { Mongoose, Schema, default: mongoose } = require("mongoose");
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
