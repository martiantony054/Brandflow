// server/routes/predict.js
const router     = require('express').Router();
const controller = require('../Controllers/Predictcontroller');

router.post('/', controller.predict);

module.exports = router;