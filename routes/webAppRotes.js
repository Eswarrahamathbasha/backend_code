const express = require('express');
const { webAppRoutesController } = require('./../controllers/webAppRoutesController');

const router = express.Router();

router.get('/', webAppRoutesController);

module.exports = router;