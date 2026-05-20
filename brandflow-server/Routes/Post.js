// server/routes/posts.js
// Returns saved post history from MongoDB.
// GET /api/posts?platform=instagram&limit=20&page=1

const router = require('express').Router();
const posting   = require('../models/Post');

router.get('/', async (req, res, next) => {
  try {
    const { platform, limit = 20, page = 1 } = req.query;
    const filter = platform ? { platform } : {};
    const skip   = (parseInt(page) - 1) * parseInt(limit);

    const [posts, total] = await Promise.all([
      Post.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
      Post.countDocuments(filter),
    ]);

    res.json({ posts, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
});

// DELETE a single post
router.delete('/:id', async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;