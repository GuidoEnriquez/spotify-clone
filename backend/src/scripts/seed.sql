-- Eliminar tablas existentes para reiniciar esquema
DROP TABLE IF EXISTS playlist_songs CASCADE;
DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS songs CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS artists CASCADE;

-- Crear tabla de artistas
CREATE TABLE IF NOT EXISTS artists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Crear tabla de álbumes
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    release_year INTEGER,
    cover_url TEXT,
    artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE
);

-- Crear tabla de canciones
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    duration_seconds INTEGER,
    track_number INTEGER,
    file_url TEXT,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Encriptada en producción
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Crear tabla de playlists
CREATE TABLE IF NOT EXISTS playlists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    deleted_at TIMESTAMP DEFAULT NULL
);

-- Crear tabla intermedia playlist_songs
CREATE TABLE IF NOT EXISTS playlist_songs (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER REFERENCES playlists(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE
);

-- Insertar Artistas
INSERT INTO artists (name, bio, image_url) VALUES
('The Midnight', 'Synthwave band from LA.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/The_Midnight.jpg/800px-The_Midnight.jpg'),
('Gunship', 'British synthwave band.', 'https://f4.bcbits.com/img/0026600984_10.jpg'),
('FM-84', 'Retro-80s pop music.', 'https://f4.bcbits.com/img/0009968479_10.jpg');

-- Insertar Álbumes
INSERT INTO albums (artist_id, title, release_year, cover_url) VALUES
(1, 'Endless Summer', 2016, 'https://f4.bcbits.com/img/a3346387071_10.jpg'),
(1, 'Nocturnal', 2017, 'https://f4.bcbits.com/img/a2322306899_10.jpg'),
(2, 'Dark All Day', 2018, 'https://f4.bcbits.com/img/a1276020586_10.jpg'),
(3, 'Atlas', 2016, 'https://f4.bcbits.com/img/a1649938830_10.jpg');

-- Insertar Canciones
INSERT INTO songs (album_id, title, duration_seconds, track_number, file_url) VALUES
(1, 'Endless Summer', 300, 1, 'http://example.com/endless_summer.mp3'),
(1, 'Sunset', 280, 2, 'http://example.com/sunset.mp3'),
(2, 'River of Darkness', 320, 1, 'http://example.com/river_of_darkness.mp3'),
(3, 'Dark All Day', 310, 1, 'http://example.com/dark_all_day.mp3'),
(4, 'Running in the Night', 290, 1, 'http://example.com/running_in_the_night.mp3');

-- Insertar Usuario de Prueba
INSERT INTO users (username, email, password) VALUES
('testuser', 'test@example.com', 'hashed_password_123');

-- Insertar Playlist de Prueba
INSERT INTO playlists (name, description, user_id) VALUES
('Synthwave Favorites', 'My top synthwave tracks', 1);

-- Agregar canciones a la playlist
INSERT INTO playlist_songs (playlist_id, song_id) VALUES
(1, 1),
(1, 3),
(1, 5);
