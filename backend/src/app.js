
require('dotenv').config();
const express = require('express');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const artistRoutes = require('./routes/artistRoutes');

app.use(express.json()); // Middleware para parsear JSON
app.use('/api/artists', artistRoutes);
app.use('/api/songs', require('./routes/songRoutes'));

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

