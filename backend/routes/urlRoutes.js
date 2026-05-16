const { GenNewShortUrl, RecordVisit } = require("../controllers/urlFunctions");
const { Router } = require("express");
const { isAuthenticated, isAdmin } = require("../controllers/authHelper");
const URL = require("../models/urlSchema");

const router = Router();

/* ---------------- CREATE SHORT URL ---------------- */

router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { longUrl, customShortId } = req.body;

    if (!longUrl) {
      return res.status(400).json({ error: "Provide URL" });
    }

    /* ---------- If customShortId provided ---------- */
    if (customShortId) {
      // length safety (backend validation)
      if (customShortId.length < 5 || customShortId.length > 7) {
        return res
          .status(400)
          .json({ error: "Short ID must be 5–7 characters" });
      }

      // 🔥 Check if shortId already exists (any user)
      const shortIdExists = await URL.findOne({ shortId: customShortId });

      if (shortIdExists) {
        return res.status(409).json({
          error: "Short ID already exists. Use a different short ID.",
        });
      }

      // URL limit check (non-admin)
      const userUrlCount = await URL.countDocuments({
        createdBy: req.user._id,
      });

      if (userUrlCount >= 5 && req.user.role !== "admin") {
        return res.status(403).json({
          error: "URL limit reached. Maximum 5 URLs allowed.",
        });
      }

      const created = await URL.create({
        shortId: customShortId,
        longUrl,
        createdBy: req.user._id,
        visitHistory: [],
      });

      return res.json(created);
    }

    /* ---------- Auto-generated shortId ---------- */
    let exists = await URL.findOne({
      longUrl,
      createdBy: req.user._id,
    });

    if (!exists) {
      const userUrlCount = await URL.countDocuments({
        createdBy: req.user._id,
      });

      if (userUrlCount >= 5 && req.user.role !== "admin") {
        return res.status(403).json({
          error: "URL limit reached. Maximum 5 URLs allowed.",
        });
      }

      await GenNewShortUrl(longUrl, req.user._id);
      exists = await URL.findOne({ longUrl, createdBy: req.user._id });
    }

    res.json(exists);
  } catch (err) {
    console.error(err);
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

/* ---------------- URL PREVIEW (OG SCRAPE) ---------------- */
router.get("/preview", async (req, res) => {
  const target = req.query.url;

  if (!target || typeof target !== "string") {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const resp = await fetch(target, { method: "GET" });
    const text = await resp.text();

    const extract = (prop) => {
      const re = new RegExp(
        `<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["'][^>]*>`,
        "i",
      );
      const m = text.match(re);
      return m ? m[1] : null;
    };

    const title = extract("og:title") || extract("twitter:title") || null;
    const description =
      extract("og:description") || extract("twitter:description") || null;
    const image = extract("og:image") || null;
    const siteName = extract("og:site_name") || null;

    const favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${encodeURIComponent(
      target,
    )}`;

    res.json({ title, description, image, siteName, favicon });
  } catch (err) {
    console.error("Preview fetch error:", err);
    res.status(500).json({ error: "Failed to fetch preview" });
  }
});

/* ---------------- REDIRECT ---------------- */
router.get("/:shortId", async (req, res) => {
  const entry = await RecordVisit(req.params.shortId, req);

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
