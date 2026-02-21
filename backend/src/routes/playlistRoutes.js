const express = require('express');
const router = express.Router();
const {createPlaylist, getPlaylistsByUser, addSongToPlaylist, getPlaylistSongs} = require('../controllers/playlistController');

router.post('/', createPlaylist);
// Ruta para asociar una canción a una playlist
router.post('/add-song', addSongToPlaylist);
// Ruta para obtener las canciones de una playlist
router.get('/:playlistId/songs', getPlaylistSongs);
router.get('/:user_id', getPlaylistsByUser);

module.exports = router;