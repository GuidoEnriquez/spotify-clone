const pool = require('../config/db');

const getSongs = async (req, res) => {
    try {
        const query = `
            SELECT s.*, a.title as album_name 
            FROM songs s
            JOIN albums a ON s.album_id = a.id
            WHERE s.deleted_at IS NULL
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener canciones' });
    }
};

const getSongById = async (req, res) => {
    const {id} = req.params;

    try{
        const query = `
           SELECT * FROM songs WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        if(result.rows.length === 0){
            return res.status(404).json({error: 'Canción no encontrada'});
        }
        res.json(result.rows[0]);
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Error al obtener la canción'});
    }
}

module.exports = { getSongs, getSongById };