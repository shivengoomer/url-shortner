const { GenNewShortUrl } = require("../controllers/urlFunctions");
const { Router } = require("express");
const router = Router();
const URL = require("../models/urlSchema");
router.post("/", async (req, res) => {
  const userUrl = req.body.longUrl;
  if (!userUrl) {
    res.json({ error: "provide url" });
  }

  let exists = await URL.findOne({ longUrl: userUrl }); // FIX
  if (!exists) {
    GenNewShortUrl(userUrl);
  }
  res.json(exists);
  
});

module.exports = router;
