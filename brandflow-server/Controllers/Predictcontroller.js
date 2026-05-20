const openrouter = require("../services/openrouterservice");
const posting = require("../models/Post");

async function predict(req, res, next) {
  try {
    const { content, platform, scheduledTime, postId } = req.body;

    // Call Claude
    const result = await openrouter.predictPost({
      content,
      platform,
      scheduledTime,
    });
    const score = result.score ?? result;

    // If the post exists in DB, attach the score to it
    if (postId) {
      await Post.findByIdAndUpdate(postId, {
        prediction: {
          overall: score.overall,
          hook: score.hook,
          timing: score.timing,
          hashtags: score.hashtags,
          readability: score.readability,
          verdict: score.verdict,
          tips: score.tips ?? [],
          scoredAt: new Date(),
        },
      });
    }

    res.json({ score });
  } catch (err) {
    next(err);
  }
}

module.exports = { predict };
