# Spotify Clone

Una aplicación web full-stack que replica las funcionalidades básicas de Spotify, permitiendo a los usuarios registrarse, explorar música, crear listas de reproducción personalizadas y disfrutar de una experiencia de reproducción completa.

## ✨ Funcionalidades

- **Autenticación de Usuarios**: Registro e inicio de sesión seguro (contraseñas hasheadas y almacenamiento de sesión).
- **Dashboard Interactivo**: Interfaz moderna de temática oscura inspirada en Spotify utilizando Bootstrap 5.
- **Reproductor de Música Funcional**:
  - Reproducción continua utilizando audios reales almacenados en la nube.
  - Barra de progreso interactiva (seek).
  - Control de volumen interactivo y botón de silenciar (mute).
  - Sincronización visual del artista, título de canción y portada generada automáticamente.
- **Gestión de Playlists**:
  - Creación de listas de reproducción personalizadas.
  - Agregar canciones a múltiples listas a través de menús desplegables.
  - Filtrado dinámico para ver únicamente las canciones de una playlist en particular seleccionándola en la barra lateral.
- **Buscador en Tiempo Real**: Filtrado dinámico de canciones por nombre de pista o artista directamente en la interfaz principal.

## 🛠️ Tecnologías Utilizadas

### Frontend

- HTML5 y CSS3 (Custom Spotify Theme)
- JavaScript (Vanilla JS, manipulación del DOM y Fetch API)
- Bootstrap 5 (Grillas, Componentes, Utilidades) e Icons

### Backend

- Node.js
- Express.js (API REST)
- Cors, Dotenv, y Bcryptjs

### Base de Datos y Almacenamiento

- **Supabase (PostgreSQL)**: Gestión de base de datos relacional en la nube (`users`, `artists`, `albums`, `songs`, `playlists`, `playlist_songs`).
- **Supabase Storage**: Alojamiento en la nube (Public Bucket) para los archivos `.mp3`.

## 🚀 Configuración y Ejecución local

### 1. Requisitos Previos

- [Node.js](https://nodejs.org/) instalado en tu entorno local.
- Un proyecto habilitado en [Supabase](https://supabase.com/).

### 2. Configuración del Entorno (Backend)

Clona el repositorio e instala las dependencias del servidor:

```bash
cd backend
npm install
```

Crea un archivo `.env` en la carpeta `backend` con el siguiente formato:

```env
PORT=4000
DATABASE_URL="postgres://postgres.xxxxx:tu-password-seguro@aws-0-REGION.pooler.supabase.com:6543/postgres"
```

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

### 3. Ejecutar el Frontend

Dado que el frontend está construido con Vanilla JS, HTML y CSS estático, basta con abrir el archivo `frontend/index.html` en tu navegador web o utilizar la extensión _Live Server_ de tu editor de código.

## 🗄️ Esquema de la Base de Datos

Las tablas principales en Supabase se dividen en:

- `users`: Registra los usuarios autenticados.
- `artists` & `albums`: Catálogo musical.
- `songs`: Información de pistas (Título, URL de Storage, ID del Álbum).
- `playlists` & `playlist_songs`: Permiten la relación de "Muchos a Muchos" para guardar canciones en listas personalizadas.

---

_Desarrollado como proyecto de aprendizaje explorando la integración de bases de datos serverless (Supabase) con APIs en Node.js y un Frontend Vanilla responsivo._
