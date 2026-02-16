
require('dotenv').config();
const express = require('express');
const pool = require('./config/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const artistRoutes = require('./routes/artistRoutes');
const songRoutes = require('./routes/songRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const userRoutes = require('./routes/userRoutes');


app.use(cors());
app.use(express.json()); // Middleware para parsear JSON
app.use('/api/artists', artistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/users', userRoutes);

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM artists');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error conectando a la base de datos');
  }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto en http://localhost:${PORT}`);
}) ;

