const openrouter = require("../Services/openrouterservice");
const Post = require("../Models/Post");

async function generate(req, res, next) {
  try {
    const { platform, topic, tone } = req.body;

    // Call Claude
    const result = await openrouter.generatePosts({ platform, topic, tone });
    const posts = (result.posts ?? []).map((p, i) => ({ ...p, index: i }));

    // Save all generated posts to MongoDB
    const saved = await Post.insertMany(
      posts.map((p) => ({
        content: p.content,
        hashtags: p.hashtags ?? [],
        platform,
        tone,
        angle: p.angle ?? "",
        bestTime: p.best_time ?? "",
        source: "generated",
      })),
    );

    // Attach MongoDB _id to each post so frontend can reference it for Predict
    const response = posts.map((p, i) => ({
      ...p,
      _id: saved[i]._id,
    }));

    res.json({ posts: response });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate };
