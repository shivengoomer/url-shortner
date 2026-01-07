const Url = require("../models/urlSchema");
const shortid = require("shortid");

const GenNewShortUrl = async (userUrl, userId) => {
  shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
  );
  const shortId = shortid.generate(7);
  await Url.create({
    shortId: shortId,
    longUrl: userUrl,
    createdBy: userId,
    visitHistory: [],
  });
};

module.exports = { GenNewShortUrl };
