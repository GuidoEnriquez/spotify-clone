
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

    // 6. Crear Playlist
    document.getElementById("createPlaylistForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("playlistName").value;
        const description = document.getElementById("playlistDesc").value;

        try {
            const response = await fetch('http://localhost:4000/api/playlists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, user_id: user.id })
            });

            if (response.ok) {
                document.getElementById("createPlaylistForm").reset();
                loadPlaylists(user.id); // Recargar la lista
            } else {
                alert("Error al crear playlist");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    });

    // 5. Cargar Playlists (Simulado por ahora)
    loadPlaylists(user.id);
});

async function loadPlaylists(userId) {
    const container = document.getElementById('playlistsContainer');
    try {
        const response = await fetch(`http://localhost:4000/api/playlists/${userId}`);
        const playlists = await response.json();

        if (playlists.length === 0) {
            container.innerHTML = "<p>No tienes playlists aún.</p>";
            return;
        }

        container.innerHTML = ""; // Limpiar "Cargando..."
        playlists.forEach(playlist => {
            const div = document.createElement('div');
            // Estilo simple inline para diferenciar
            div.style.border = "1px solid #ccc";
            div.style.padding = "10px";
            div.style.margin = "5px";
            div.innerHTML = `
                <strong>${playlist.name}</strong>
                <p>${playlist.description || "Sin descripción"}</p>
            `;
            container.appendChild(div); 
        });

    } catch (error) {
        console.error("Error cargando playlists:", error);
        container.innerHTML = "<p>Error al cargar las playlists.</p>";
    }
}
