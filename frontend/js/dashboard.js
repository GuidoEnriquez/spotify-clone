document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener usuario del localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. Si no hay usuario, redirigir al login
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // 3. Mostrar nombre del usuario
    document.getElementById('usernameDisplay').textContent = user.username;

    // 4. Lógica de Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // 5. Cargar Playlists
    loadPlaylists(user.id);
    
    // 6. Cargar Canciones
    loadSongs();

    // 7. Crear Playlist
    document.getElementById("createPlaylistForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("playlistName").value;
        const description = ""; // Opcional, lo omitimos por simplicidad en esta UI

        try {
            const response = await fetch('http://localhost:4000/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, user_id: user.id })
            });

            if (response.ok) {
                document.getElementById("createPlaylistForm").reset();
                loadPlaylists(user.id); // Recargar la lista en la sidebar
            } else {
                alert("Error al crear playlist");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión al crear playlist");
        }
    });

});

let userPlaylists = []; // Variable global para guardar las playlists y usarlas en los menús

// ... (código existente hasta loadSongs) ...

// Función helper para escapar comillas simples en strings que van dentro de HTML (ej. onclick)
function escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'");
}

async function loadSongs() {
    const container = document.getElementById('songsContainer');
    try {
        const response = await fetch('http://localhost:4000/api/songs');
        const songs = await response.json();

        if (songs.length === 0) {
            container.innerHTML = '<div class="col"><p class="text-secondary">No hay canciones disponibles.</p></div>';
            return;
        }

        container.innerHTML = "";
        songs.forEach(song => {
            
            // Generar los items del menú desplegable para agregar a playlist
            let playlistMenuHTML = userPlaylists.map(pl => 
                `<li><button class="dropdown-item text-white" onclick="addToPlaylist(${song.id}, ${pl.id})">${pl.name}</button></li>`
            ).join('');
            
            if (userPlaylists.length === 0) {
                playlistMenuHTML = `<li><span class="dropdown-item text-secondary disabled">Crea una playlist primero</span></li>`;
            }

            const safeTitle = escapeQuotes(song.title);
            const safeAlbum = escapeQuotes(song.album_name || 'Desconocido');

            // Tarjeta de canción estilo Spotify
            const div = document.createElement('div');
            div.className = 'col';
            div.innerHTML = `
                <div class="card h-100 bg-dark text-white border-0 song-card" style="background-color: #181818 !important; border-radius: 8px; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#282828'" onmouseout="this.style.backgroundColor='#181818'">
                    <div class="position-relative p-3 pb-0">
                        <img src="https://ui-avatars.com/api/?name=${song.title}&background=random&color=fff&size=200" class="card-img-top rounded shadow" alt="${song.title}">
                        <button class="btn btn-success rounded-circle position-absolute shadow play-btn" style="bottom: 8px; right: 24px; width: 48px; height: 48px; opacity: 0; transition: all 0.2s; transform: translateY(8px);" onclick="playSong(${song.id}, '${safeTitle}', '${safeAlbum}', '${song.file_url}')">
                            <i class="bi bi-play-fill fs-3 text-dark d-flex justify-content-center align-items-center h-100 w-100"></i>
                        </button>
                    </div>
                    <div class="card-body px-3 pt-3 pb-4 position-relative">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="card-title text-truncate mb-1 fw-bold" style="max-width: 120px;">${song.title}</h6>
                                <p class="card-text small text-secondary text-truncate mb-0" style="max-width: 120px;">${song.album_name || 'Desconocido'}</p>
                            </div>
                            
                            <!-- Menú de opciones (3 puntitos) -->
                            <div class="dropdown">
                                <button class="btn btn-link text-secondary p-0 text-decoration-none dropdown-toggle-no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-dark shadow">
                                    <li><h6 class="dropdown-header">Añadir a Playlist:</h6></li>
                                    ${playlistMenuHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            // Agregamos CSS inline para el efecto hover del botón de play
            div.querySelector('.song-card').addEventListener('mouseenter', function() {
                const btn = this.querySelector('.play-btn');
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            });
            div.querySelector('.song-card').addEventListener('mouseleave', function() {
                const btn = this.querySelector('.play-btn');
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(8px)';
            });

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error:", error);
        container.innerHTML = '<div class="col"><p class="text-danger">Error al cargar canciones desde el servidor.</p></div>';
    }
}

async function loadPlaylists(userId) {
    const container = document.getElementById('playlistsContainer');
    try {
        const response = await fetch(`http://localhost:4000/api/playlists/${userId}`);
        const playlists = await response.json();
        
        userPlaylists = playlists; // Guardar en variable global
        
        // ¡IMPORTANTE! Si ya cargamos las canciones pero aún no las playlists, 
        // necesitamos recargar las canciones para que los menús se armen bien
        if (document.getElementById('songsContainer').children.length > 0) {
            loadSongs();
        }

        if (playlists.length === 0) {
            container.innerHTML = '<p class="small">Aún no tienes playlists.</p>';
            return;
        }

        container.innerHTML = '<ul class="list-unstyled mb-0"></ul>';
        const ul = container.querySelector('ul');
        
        playlists.forEach(playlist => {
            const li = document.createElement('li');
            li.className = 'nav-item mb-1';
            li.innerHTML = `
                <a href="#" class="nav-link px-0 text-secondary text-truncate" style="font-size: 0.9rem;" onclick="viewPlaylist(${playlist.id}, '${playlist.name}')">
                    ${playlist.name}
                </a>
            `;
            ul.appendChild(li); 
        });

    } catch (error) {
        console.error("Error cargando playlists:", error);
        container.innerHTML = '<p class="small text-danger">Error al cargar playlists.</p>';
    }
}

// NUEVA FUNCIÓN: Ver el contenido de una playlist
async function viewPlaylist(playlistId, playlistName) {
    // 1. Cambiar el título de la sección principal
    document.querySelector('main section h2').textContent = playlistName;
    
    // 2. Mostrar indicador de carga
    const container = document.getElementById('songsContainer');
    container.innerHTML = '<div class="col"><p class="text-secondary">Cargando canciones de la playlist...</p></div>';

    // 3. Hacer el fetch al nuevo endpoint
    try {
        const response = await fetch(`http://localhost:4000/api/playlists/${playlistId}/songs`);
        const songs = await response.json();

        if (songs.length === 0) {
            container.innerHTML = '<div class="col"><p class="text-secondary">Esta playlist está vacía.</p></div>';
            return;
        }

        container.innerHTML = "";
        
        songs.forEach(song => {
            // Reutilizamos la misma vista de tarjeta que en loadSongs
            // Generar los items del menú desplegable para agregar a playlist (por si quieren moverla a otra)
            let playlistMenuHTML = userPlaylists.map(pl => 
                `<li><button class="dropdown-item text-white" onclick="addToPlaylist(${song.id}, ${pl.id})">${pl.name}</button></li>`
            ).join('');
            
            if (userPlaylists.length === 0) {
                playlistMenuHTML = `<li><span class="dropdown-item text-secondary disabled">Crea una playlist primero</span></li>`;
            }

            const safeTitle = escapeQuotes(song.title);
            const safeAlbum = escapeQuotes(song.album_name || 'Desconocido');

            const div = document.createElement('div');
            div.className = 'col';
            div.innerHTML = `
                <div class="card h-100 bg-dark text-white border-0 song-card" style="background-color: #181818 !important; border-radius: 8px; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#282828'" onmouseout="this.style.backgroundColor='#181818'">
                    <div class="position-relative p-3 pb-0">
                        <img src="https://ui-avatars.com/api/?name=${song.title}&background=random&color=fff&size=200" class="card-img-top rounded shadow" alt="${song.title}">
                        <button class="btn btn-success rounded-circle position-absolute shadow play-btn" style="bottom: 8px; right: 24px; width: 48px; height: 48px; opacity: 0; transition: all 0.2s; transform: translateY(8px);" onclick="playSong(${song.id}, '${safeTitle}', '${safeAlbum}', '${song.file_url}')">
                            <i class="bi bi-play-fill fs-3 text-dark d-flex justify-content-center align-items-center h-100 w-100"></i>
                        </button>
                    </div>
                    <div class="card-body px-3 pt-3 pb-4 position-relative">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h6 class="card-title text-truncate mb-1 fw-bold" style="max-width: 120px;">${song.title}</h6>
                                <p class="card-text small text-secondary text-truncate mb-0" style="max-width: 120px;">${song.album_name || 'Desconocido'}</p>
                            </div>
                            
                            <!-- Menú de opciones (3 puntitos) -->
                            <div class="dropdown">
                                <button class="btn btn-link text-secondary p-0 text-decoration-none dropdown-toggle-no-caret" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="bi bi-three-dots-vertical"></i>
                                </button>
                                <ul class="dropdown-menu dropdown-menu-dark shadow">
                                    <li><h6 class="dropdown-header">Añadir a Playlist:</h6></li>
                                    ${playlistMenuHTML}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            div.querySelector('.song-card').addEventListener('mouseenter', function() {
                const btn = this.querySelector('.play-btn');
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            });
            div.querySelector('.song-card').addEventListener('mouseleave', function() {
                const btn = this.querySelector('.play-btn');
                btn.style.opacity = '0';
                btn.style.transform = 'translateY(8px)';
            });

            container.appendChild(div);
        });

    } catch (error) {
        console.error("Error al cargar las canciones de la playlist:", error);
        container.innerHTML = '<div class="col"><p class="text-danger">Error al cargar la playlist.</p></div>';
    }
}

// NUEVA FUNCIÓN: Añadir canción a playlist mediante fetch
async function addToPlaylist(songId, playlistId) {
    try {
        const response = await fetch(`http://localhost:4000/api/playlists/add-song`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playlistId, songId })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert("¡Canción añadida a la playlist!");
        } else {
            alert(result.error || "Error al añadir la canción");
        }
    } catch (error) {
        console.error("Error al añadir:", error);
        alert("Error de conexión");
    }
}

// Reproductor de Audio
const audioPlayer = document.getElementById('audioPlayer');
const masterPlayBtn = document.getElementById('masterPlayBtn');
const masterPlayIcon = masterPlayBtn.querySelector('i');
let currentSongId = null;

// Escuchar cuando el usuario hace click en el botón central de Play/Pausa del reproductor (Footer)
masterPlayBtn.addEventListener('click', () => {
    if (audioPlayer.src) { // Si hay una canción cargada
        if (audioPlayer.paused) {
            audioPlayer.play();
            masterPlayIcon.classList.remove('bi-play-fill');
            masterPlayIcon.classList.add('bi-pause-fill');
        } else {
            audioPlayer.pause();
            masterPlayIcon.classList.remove('bi-pause-fill');
            masterPlayIcon.classList.add('bi-play-fill');
        }
    }
});

// Función para reproducir desde una tarjeta
function playSong(songId, title, artist, fileUrl) {
    // 1. Actualizar barra de reproducción visualmente
    document.getElementById('playerTitle').textContent = title;
    document.getElementById('playerArtist').textContent = artist;
    document.getElementById('playerCoverPlaceholder').style.backgroundImage = `url('https://ui-avatars.com/api/?name=${title}&background=random&color=fff&size=56')`;
    document.getElementById('playerCoverPlaceholder').style.backgroundSize = 'cover';

    // 2. Si es la misma canción que ya estaba sonando y estaba pausada, la reanudamos
    if (currentSongId === songId && audioPlayer.paused) {
        audioPlayer.play();
        masterPlayIcon.classList.remove('bi-play-fill');
        masterPlayIcon.classList.add('bi-pause-fill');
        return;
    }

    // 3. Si es una canción nueva, cargamos la URL y reproducimos
    currentSongId = songId;
    audioPlayer.src = fileUrl;
    audioPlayer.play()
        .then(() => {
            // Cambiar icono central a pausa
            masterPlayIcon.classList.remove('bi-play-fill');
            masterPlayIcon.classList.add('bi-pause-fill');
        })
        .catch(err => {
            console.error("Error al reproducir audio:", err);
            alert("No se pudo reproducir el audio. Verifica que la URL sea válida.");
        });
}

// Escuchar cuando la canción termina para volver a poner el icono de Play
audioPlayer.addEventListener('ended', () => {
    masterPlayIcon.classList.remove('bi-pause-fill');
    masterPlayIcon.classList.add('bi-play-fill');
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
});

// Actualizar barra de progreso y tiempo actual
audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        document.getElementById('progressBar').style.width = `${progressPercent}%`;
        document.getElementById('currentTime').textContent = formatTime(audioPlayer.currentTime);
    }
});

// Cuando carga la metadata del audio, mostramos la duración total
audioPlayer.addEventListener('loadedmetadata', () => {
    document.getElementById('totalTime').textContent = formatTime(audioPlayer.duration);
});

// Permitir saltar a una parte de la canción haciendo clic en la barra
document.getElementById('progressContainer').addEventListener('click', (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    
    if (duration) {
        audioPlayer.currentTime = (clickX / width) * duration;
    }
});

// Utilidad para formatear segundos a mm:ss
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// === CONTROL DE VOLUMEN ===
const volumeContainer = document.getElementById('volumeContainer');
const volumeBar = document.getElementById('volumeBar');
const volumeIcon = document.getElementById('volumeIcon');

// Al iniciar, el audio empieza en 50%
audioPlayer.volume = 0.5;

// Cambiar volumen al hacer clic en la barra
volumeContainer.addEventListener('click', (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const volumePercent = (clickX / width);
    
    // Actualizar audio
    audioPlayer.volume = volumePercent;
    
    // Actualizar UI
    volumeBar.style.width = `${volumePercent * 100}%`;
    updateVolumeIcon(volumePercent);
});

// Función para actualizar el icono según el volumen
function updateVolumeIcon(volume) {
    volumeIcon.className = 'text-secondary '; // reset
    if (volume === 0) {
        volumeIcon.className += 'bi bi-volume-mute-fill';
    } else if (volume < 0.5) {
        volumeIcon.className += 'bi bi-volume-down';
    } else {
        volumeIcon.className += 'bi bi-volume-up';
    }
}

// Mutear al hacer clic en el icono
let lastVolume = 0.5;
volumeIcon.addEventListener('click', () => {
    if (audioPlayer.volume > 0) {
        // Guardar volumen actual y mutear
        lastVolume = audioPlayer.volume;
        audioPlayer.volume = 0;
        volumeBar.style.width = '0%';
        updateVolumeIcon(0);
    } else {
        // Desmutear al volumen anterior
        audioPlayer.volume = lastVolume;
        volumeBar.style.width = `${lastVolume * 100}%`;
        updateVolumeIcon(lastVolume);
    }
    volumeIcon.style.cursor = 'pointer';
});
volumeIcon.style.cursor = 'pointer'; // Añadir cursor pointer al icono de una vez

// === BARRA DE BÚSQUEDA ===
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    // Obtener todas las columnas que contienen las tarjetas de canciones
    const songColumns = document.querySelectorAll('#songsContainer .col');

    songColumns.forEach(col => {
        // Ignorar si es un mensaje de error o "Cargando"
        if (!col.querySelector('.song-card')) return;

        // Obtener título y artista de la tarjeta actual
        const title = col.querySelector('.card-title').textContent.toLowerCase();
        const artist = col.querySelector('.card-text').textContent.toLowerCase();

        // Comprobar si hay coincidencia
        if (title.includes(searchTerm) || artist.includes(searchTerm)) {
            col.style.display = ''; // Mostrar
        } else {
            col.style.display = 'none'; // Ocultar
        }
    });
});
