const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const { genToken,check, isAdmin } = require("../controllers/authHelper");
const User = require("../models/userSchema");
dotenv.config();

router.post("/new", async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password)
    return res.status(400).json({ msg: "Please provide all data required" });

  try {
    let us = await User.findOne({ email });
    if (us) return res.status(400).json({ msg: "User exists" });
    const user = new User({
      email,
      phone,
      password,
      role: role || "user",
      profile: {
        firstName: name.split(" ")[0],
        lastName: name.split(" ").slice(1).join(" ") || "",
      },
    });
    await user.save();
    console.log("new user created");
    const token = genToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
    console.log("cookie created");
  } catch (err) {
    console.log(err);
    res.send("Server error");
  }
});
// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Please provide all data" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "user not found" });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ msg: "wrong password" });

  const token = genToken(user.id);
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token,
    user: {
      id: user.id,
      name: `${user.profile.firstName} ${user.profile.lastName}`,
      email: user.email,
      role: user.role,
    },
  });
  console.log("logged in");
});

// logut - clearing cookie
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logging out" });
});

// Get current user
router.get("/me", check, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        profile: req.user.profile,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
});

// update profile
router.patch("/me", check, async (req, res) => {
  const { profile, phone } = req.body;
  if (profile) {
    if (profile.firstName) req.user.profile.firstName = profile.firstName;
    if (profile.lastName) req.user.profile.lastName = profile.lastName;
    if (profile.address) req.user.profile.address = profile.address;
    if (profile.state) req.user.profile.state = profile.state;
    if (profile.zipCode) req.user.profile.zipCode = profile.zipCode;
  }

  if (phone) req.user.phone = phone;

  await req.user.save();

  res.json({
    msg: "Profile updated",
    user: {
      id: req.user._id,
      name: `${req.user.profile.firstName} ${req.user.profile.lastName}`,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
      profile: req.user.profile,
    },
  });
});

// Get all users (admin only)
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update user role (admin only)
router.patch("/users/:id/role", isAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "volunteer", "authority", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      msg: "User role updated",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete user (admin only)
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
