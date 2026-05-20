// server/routes/generate.js
const router     = require('express').Router();
const controller = require('../Controllers/Gencontroller');

router.post('/', controller.generate);

module.exports = router;