
const pool = require('../config/db');


const createPlaylist = async(req, res) => {
    const {name, description, user_id} = req.body;

    if(!name || !user_id){
        return res.status(400).json({error: 'El nombre de la playlist y el ID del usuario son obligatorios'});
    }
    try{
        const query = 'INSERT INTO playlists (name, description, user_id) VALUES ($1, $2, $3) RETURNING *';
        const values = [name, description, user_id];
        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Error al crear la playlist'});
    }
}

const getPlaylistsByUser = async(req, res) => {
    const {userId} = req.params; // CUIDADO: en la ruta definimos :userId o :user_id? Chequearemos. Usualmente params se llama user_id según tu código original, vamos a corregirlo según tu route.
    // Viendo tu código original, req.params.user_id es lo correcto según playlistRoutes.js
    const {user_id} = req.params;

    try {
        const query = 'SELECT * FROM playlists WHERE user_id = $1';
        const values = [user_id];
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener las playlists'});
    }
}

// NUEVA FUNCIÓN: Agregar canción a playlist
const addSongToPlaylist = async(req, res) => {
    const { playlistId, songId } = req.body;

    if (!playlistId || !songId) {
        return res.status(400).json({error: 'Faltan parámetros (playlistId, songId)'});
    }

    try {
        // 1. Verificar si la canción ya está en la playlist (para no duplicar)
        const checkQuery = 'SELECT * FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2';
        const checkResult = await pool.query(checkQuery, [playlistId, songId]);
        
        if (checkResult.rows.length > 0) {
            return res.status(400).json({error: 'La canción ya existe en esta playlist'});
        }

        // 2. Insertar la relación
        const insertQuery = 'INSERT INTO playlist_songs (playlist_id, song_id) VALUES ($1, $2) RETURNING *';
        const insertResult = await pool.query(insertQuery, [playlistId, songId]);
        
        res.status(201).json({ message: 'Canción añadida con éxito', record: insertResult.rows[0] });
    } catch (error) {
        console.error("Error al añadir canción a playlist:", error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
}

// NUEVA FUNCIÓN: Obtener canciones de una playlist
const getPlaylistSongs = async (req, res) => {
    const { playlistId } = req.params;

    try {
        // Hacemos un JOIN para traer los datos de la canción y del álbum
        // Solo para las canciones que estén en la tabla playlist_songs para esta playlist
        const query = `
            SELECT s.*, a.title as album_name 
            FROM songs s
            JOIN playlist_songs ps ON s.id = ps.song_id
            LEFT JOIN albums a ON s.album_id = a.id
            WHERE ps.playlist_id = $1
        `;
        const result = await pool.query(query, [playlistId]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al obtener canciones de la playlist:", error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
}

module.exports = { createPlaylist, getPlaylistsByUser, addSongToPlaylist, getPlaylistSongs };