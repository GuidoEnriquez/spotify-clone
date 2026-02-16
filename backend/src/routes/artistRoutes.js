const express = require('express');
const router = express.Router();
const { getArtists, getArtistById, createArtist } = require('../controllers/artistController');

router.get('/', getArtists);
router.get('/:id', getArtistById);
router.post('/', createArtist);
module.exports = router;
