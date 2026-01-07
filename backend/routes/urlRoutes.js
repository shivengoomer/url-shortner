const { GenNewShortUrl } = require("../controllers/urlFunctions");
const { Router } = require("express");
const { isAuthenticated } = require("../controllers/authHelper");
const router = Router();
const URL = require("../models/urlSchema");
const urlSchema = require("../models/urlSchema");

router.post("/", isAuthenticated, async (req, res) => {
  const userUrl = req.body.longUrl;
  if (!userUrl) {
    return res.json({ error: "provide url" });
  }
  console.log(req.user._id);
  let exists = await URL.findOne({ longUrl: userUrl });
  if (!exists) {
    await GenNewShortUrl(userUrl, req.user._id);
    exists = await URL.findOne({ longUrl: userUrl });
  }
  res.json(exists);
});

router.get("/", isAuthenticated, async (req, res) => {
  const urls = await URL.find({ createdBy: req.user._id });
  res.json(urls);
});

router.get("/analytics/:shortId", isAuthenticated, async (req, res) => {
  const reqUrl = await URL.findOne({ shortId: req.params.shortId });
  res.json({
    reqUrl,
    totalClicks: reqUrl.visitHistory.length,
  });
});
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
