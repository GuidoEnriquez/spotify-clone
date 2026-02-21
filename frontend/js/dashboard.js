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
            // Tarjeta de canción estilo Spotify
            const div = document.createElement('div');
            div.className = 'col';
            div.innerHTML = `
                <div class="card h-100 bg-dark text-white border-0 song-card" style="background-color: #181818 !important; border-radius: 8px; transition: background-color 0.3s;" onmouseover="this.style.backgroundColor='#282828'" onmouseout="this.style.backgroundColor='#181818'">
                    <div class="position-relative p-3 pb-0">
                        <img src="https://ui-avatars.com/api/?name=${song.title}&background=random&color=fff&size=200" class="card-img-top rounded shadow" alt="${song.title}">
                        <button class="btn btn-success rounded-circle position-absolute shadow play-btn" style="bottom: 8px; right: 24px; width: 48px; height: 48px; opacity: 0; transition: all 0.2s; transform: translateY(8px);" onclick="playSong(${song.id}, '${song.title}', '${song.album_name || 'Desconocido'}')">
                            <i class="bi bi-play-fill fs-3 text-dark d-flex justify-content-center align-items-center h-100 w-100"></i>
                        </button>
                    </div>
                    <div class="card-body px-3 pt-3 pb-4">
                        <h6 class="card-title text-truncate mb-1 fw-bold">${song.title}</h6>
                        <p class="card-text small text-secondary text-truncate mb-0">${song.album_name || 'Desconocido'}</p>
                    </div>
                </div>
            `;
            // Agregamos un poco de CSS inline para el efecto hover del botón de play
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
                <a href="#" class="nav-link px-0 text-secondary text-truncate" style="font-size: 0.9rem;">
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

// Función placeholder para reproducir
function playSong(songId, title, artist) {
    // Actualizar barra de reproducción
    document.getElementById('playerTitle').textContent = title;
    document.getElementById('playerArtist').textContent = artist;
    document.getElementById('playerCoverPlaceholder').style.backgroundImage = `url('https://ui-avatars.com/api/?name=${title}&background=random&color=fff&size=56')`;
    document.getElementById('playerCoverPlaceholder').style.backgroundSize = 'cover';
}
