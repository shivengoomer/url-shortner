const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const { genToken, check, isAdmin } = require("../controllers/authHelper");
const User = require("../models/userSchema");

dotenv.config();

/* 
   REGISTER
 */
router.post("/new", async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      msg: "All fields (name, email, phone, password) are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        msg: "An account with this email already exists",
      });
    }

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

    const token = genToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

/* 
   LOGIN
*/
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      msg: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        msg: "No account found with this email",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        msg: "Incorrect password. Please try again",
      });
    }

    const token = genToken(user.id);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user.id,
        name: `${user.profile.firstName} ${user.profile.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

/* 
   LOGOUT
*/
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
});

/* 
   CURRENT USER
 */
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
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

/* 
   UPDATE PROFILE
*/
router.patch("/me", check, async (req, res) => {
  const { profile, phone } = req.body;

  if (profile) {
    Object.assign(req.user.profile, profile);
  }

  if (phone) {
    req.user.phone = phone;
  }

  await req.user.save();

  res.json({
    msg: "Profile updated successfully",
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

/* 
   ADMIN: GET ALL USERS*/
router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

/* 
   ADMIN: UPDATE USER ROLE */
router.patch("/users/:id/role", isAdmin, async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({
      msg: "Invalid role provided",
    });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      msg: "User role updated successfully",
      user: { ...user.toObject(), password: undefined },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

/*    ADMIN: DELETE USER*/
router.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        msg: "You cannot delete your own account",
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
