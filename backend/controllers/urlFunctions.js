const Url = require("../models/urlSchema");
const shortid = require("shortid");

const GenNewShortUrl = async (userUrl, res) => {
  shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
  );
  const shortId = shortid.generate(7);
  await Url.create({
    shortId: shortId,
    longUrl: userUrl,
    visitHistory: [],
  });
  res.json(shortId);
};

module.exports = { GenNewShortUrl };
