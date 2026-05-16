const Url = require("../models/urlSchema");
const shortid = require("shortid");

const GenNewShortUrl = async (userUrl, userId) => {
  shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@",
  );
  const shortId = shortid.generate(7);
  await Url.create({
    shortId: shortId,
    longUrl: userUrl,
    createdBy: userId,
    visitHistory: [],
  });
};

const RecordVisit = async (shortId, req) => {
  const userAgent = req.headers["user-agent"] || "";
  const referrer = req.headers["referer"] || req.headers["referrer"] || "";
  const country = req.headers["cf-ipcountry"] || req.headers["x-country"] || "";
  const ip =
    (req.headers["x-forwarded-for"] &&
      req.headers["x-forwarded-for"].split(",")[0]) ||
    req.ip ||
    (req.connection && req.connection.remoteAddress) ||
    "";

  return await Url.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
          userAgent,
          referrer,
          country,
          ip,
        },
      },
    },
    { new: true },
  );
};

module.exports = { GenNewShortUrl, RecordVisit };
