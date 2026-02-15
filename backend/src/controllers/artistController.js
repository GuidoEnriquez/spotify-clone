const pool = require('../config/db');

const getArtists = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM artists ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error conectando a la base de datos');
    }
};

const getArtistById = async (req, res) => {
    const { id } = req.params;
    try {
        // Consultamos el artista y sus álbumes usando LEFT JOIN
        // El LEFT JOIN es clave porque si el artista no tiene álbumes aún,
        // igual queremos ver sus datos básicos.
        const query = `
            SELECT 
                a.id as artist_id, a.name, a.bio, a.image_url,
                al.id as album_id, al.title as album_title, al.release_year
            FROM artists a
            LEFT JOIN albums al ON a.id = al.artist_id
            WHERE a.id = $1
        `;
        
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }

        // Como el JOIN repite los datos del artista por cada álbum, 
        // lo formateamos para que sea un objeto prolijo.
        const artist = {
            id: result.rows[0].artist_id,
            name: result.rows[0].name,
            bio: result.rows[0].bio,
            image_url: result.rows[0].image_url,
            albums: result.rows
                .filter(row => row.album_id !== null)
                .map(row => ({
                    id: row.album_id,
                    title: row.album_title,
                    year: row.release_year
                }))
        };
        
        res.json(artist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el perfil del artista' });
    }
};

module.exports = { getArtists, getArtistById };
