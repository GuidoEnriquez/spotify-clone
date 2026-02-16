
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

module.exports = { createPlaylist, getPlaylistsByUser };