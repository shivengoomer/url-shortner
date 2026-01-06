const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    // user details that can be updated by user or shown in profile section adding email and phone deatils
    profile: {
      firstName: String,
      lastName: String,
      address: String,
      state: String,
      zipCode: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

// hashing password - before adding to db for safety
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// checking password while login to check real password
userSchema.methods.comparePassword = async function (givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
