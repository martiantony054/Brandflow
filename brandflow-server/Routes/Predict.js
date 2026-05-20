// server/routes/predict.js
const router     = require('express').Router();
const controller = require('../controllers/Predictcontroller');

router.post('/', controller.predict);

module.exports = router;