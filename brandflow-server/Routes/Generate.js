// server/routes/generate.js
const router     = require('express').Router();
const controller = require('../controllers/Gencontroller');

router.post('/', controller.generate);

module.exports = router;