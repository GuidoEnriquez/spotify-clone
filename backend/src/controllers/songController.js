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

module.exports = { getSongs };