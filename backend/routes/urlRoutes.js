const { GenNewShortUrl } = require("../controllers/urlFunctions");
const { Router } = require("express");
const { isAuthenticated, isAdmin } = require("../controllers/authHelper");
const URL = require("../models/urlSchema");

const router = Router();

/* ---------------- CREATE SHORT URL ---------------- */
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userUrl = req.body.longUrl;
    if (!userUrl) {
      return res.status(400).json({ error: "Provide URL" });
    }

    let exists = await URL.findOne({ longUrl: userUrl });

    if (!exists) {
      await GenNewShortUrl(userUrl, req.user._id);
      exists = await URL.findOne({ longUrl: userUrl });
    }

    res.json(exists);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- GET URLs (ADMIN / USER) ---------------- */
router.get("/", isAuthenticated, async (req, res) => {
  try {
    let urls;

    if (req.user.role === "admin") {
      urls = await URL.find(); // admin → all URLs
    } else {
      urls = await URL.find({ createdBy: req.user._id }); // user → own URLs
    }

    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- DELETE SHORT URL ---------------- */
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const url = await URL.findById(req.params.id);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    // admin can delete any, user only own
    if (
      req.user.role !== "admin" &&
      url.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await URL.findByIdAndDelete(req.params.id);
    res.json({ message: "URL deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- ANALYTICS ---------------- */
router.get("/analytics/:shortId", isAuthenticated, async (req, res) => {
  const reqUrl = await URL.findOne({ shortId: req.params.shortId });

  if (!reqUrl) {
    return res.status(404).json({ error: "Not found" });
  }

  res.json({
    reqUrl,
    totalClicks: reqUrl.visitHistory.length,
  });
});

/* ---------------- REDIRECT ---------------- */
router.get("/:shortId", async (req, res) => {
  const entry = await URL.findOneAndUpdate(
    { shortId: req.params.shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } },
    { new: true }
  );

  if (!entry) {
    return res.status(404).json({ error: "Invalid short URL" });
  }

  let redirectUrl = entry.longUrl;
  if (!/^https?:\/\//i.test(redirectUrl)) {
    redirectUrl = "https://" + redirectUrl;
  }

  res.redirect(redirectUrl);
});

module.exports = router;
