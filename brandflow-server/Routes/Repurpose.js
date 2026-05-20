// server/routes/repurpose.js
const router     = require('express').Router();
const controller = require('../controllers/Repurposecontroller');

router.post('/',controller.repurpose);

module.exports = router;