const express = require('express');
const router = express.Router();
const {createPlaylist, getPlaylistsByUser} = require('../controllers/playlistController');

router.post('/', createPlaylist);
router.get('/:user_id', getPlaylistsByUser);
module.exports = router;