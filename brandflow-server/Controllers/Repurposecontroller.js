// server/controllers/repurpose.controller.js
const openrouter = require("../services/openrouterservice");
const posting = require("../models/Post");

async function repurpose(req, res, next) {
  try {
    const { content, sourcePlatform, tone } = req.body;

    const result = await openrouter.repurposeContent({
      content,
      sourcePlatform,
      tone,
    });
    const repurposed = result.repurposed ?? [];

    // Save each repurposed version as a Post document
    await posting.insertMany(
      repurposed.map((p) => ({
        content: p.content,
        hashtags: p.hashtags ?? [],
        platform: p.platform,
        tone,
        angle: p.changes ?? "",
        source: "repurposed",
        sourcePlatform,
      })),
    );

    res.json({ repurposed });
  } catch (err) {
    next(err);
  }
}

module.exports = { repurpose };
