const express = require('express');
const router = express.Router();
const { getSongs } = require('../controllers/songController');

router.get('/', getSongs);

module.exports = router;