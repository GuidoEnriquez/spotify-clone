# Spotify Clone

Una aplicación de clon de Spotify full-stack construida con **Node.js, Express, PostgreSQL y Podman**. Este proyecto simula las funcionalidades básicas de streaming de música, incluyendo gestión de artistas, álbumes, canciones y listas de reproducción de usuarios.

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: PostgreSQL 15
- **Contenedorización**: Podman, Podman Compose (compatible con Docker)
- **Gestión de Base de Datos**: pgAdmin 4

## Requisitos Previos

- [Node.js](https://nodejs.org/) (v14 o superior)
- [Podman](https://podman.io/) (y podman-compose) o Docker

## Configuración y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/GuidoEnriquez/spotify-clone.git
cd spotify-clone
```

### 2. Configuración de Entorno

El proyecto está configurado para ser portátil entre diferentes entornos.

- El archivo `docker-compose.yml` utiliza una variable `DB_PORT` para evitar conflictos de puertos.
- En tu máquina local, si el puerto `5432` está ocupado, puedes crear un archivo `.env` en la raíz (ya está configurado en tu entorno actual) para usar otro puerto (ej: `5433`).

### 3. Iniciar la Base de Datos

Utiliza Podman Compose para levantar los contenedores de PostgreSQL y pgAdmin:

```bash
podman compose up -d
```

Esto iniciará:

- **Base de Datos (Postgres)**: Accesible en `localhost:5433` (o el puerto configurado).
- **pgAdmin**: Accesible en `http://localhost:5050` (Email: `admin@admin.com`, Password: `password`).

### 4. Iniciar el Backend

Navega al directorio del backend, instala dependencias e inicia el servidor:

```bash
cd backend
npm install
npm run dev
```

El servidor correrá en `http://localhost:3000`.

## Scripts de Base de Datos (Seeding)

El proyecto incluye un script SQL para crear el esquema y cargar datos de prueba. Si necesitas reiniciar la base de datos con datos frescos:

```bash
# Desde la raíz del proyecto
podman exec -i postgres_db psql -U postgres -d spotify < backend/src/scripts/seed.sql
```

## Estructura de la Base de Datos

El esquema base de datos relacional incluye:

- **users**: Usuarios de la plataforma (username, email, password).
- **artists**: Información de artistas (nombre, bio, foto).
- **albums**: Álbumes asociados a artistas.
- **songs**: Canciones pertenecientes a álbumes.
- **playlists**: Listas creadas por usuarios.
- **playlist_songs**: Tabla intermedia para relacionar canciones con playlists.

Todas las tablas incluyen soporte para _Soft Delete_ (`deleted_at`) y restricción de integridad referencial (`ON DELETE CASCADE`).

## Endpoints de la API (Ejemplos)

- `GET /api/artists`: Obtener todos los artistas.
- `GET /api/songs`: Obtener todas las canciones.
- `GET /test-db`: Verificar conexión a la base de datos.
