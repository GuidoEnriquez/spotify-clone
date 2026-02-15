# Clon de Spotify

Una aplicación de clon de Spotify full-stack construida con Node.js, Express, PostgreSQL y Docker.

## Características

- **API Backend**: API RESTful para gestionar artistas, canciones y álbumes.
- **Base de Datos**: Base de datos PostgreSQL para almacenamiento de datos estructurados.
- **Entorno Dockerizado**: Configuración y despliegue sencillo utilizando Docker Compose.

## Tecnologías

- **Backend**: Node.js, Express.js
- **Base de Datos**: PostgreSQL
- **Contenedorización**: Docker, Docker Compose

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [Docker](https://www.docker.com/) y Docker Compose
- [npm](https://www.npmjs.com/)

## Instalación y Configuración

1.  **Clonar el repositorio**

    ```bash
    git clone <tu-url-del-repositorio>
    cd spotify-clone
    ```

2.  **Variables de Entorno**

    Crea un archivo `.env` en el directorio `backend` (si no está presente, aunque generalmente se ignora en git) con tu configuración.

    Ejemplo `.env`:

    ```env
    PORT=3000
    DB_USER=postgres
    DB_PASSWORD=password
    DB_HOST=localhost
    DB_NAME=spotify
    DB_PORT=5432
    ```

3.  **Iniciar la Base de Datos**

    Usa Docker Compose para levantar la base de datos PostgreSQL y pgAdmin.

    ```bash
    docker-compose up -d
    ```

4.  **Instalar Dependencias del Backend**

    Navega al directorio del backend e instala las dependencias.

    ```bash
    cd backend
    npm install
    ```

5.  **Ejecutar la Aplicación**

    Inicia el servidor backend.

    ```bash
    npm run dev
    ```

    El servidor debería estar corriendo en `http://localhost:3000` (o tu puerto definido).

## Endpoints de la API

- `GET /api/artists`: Obtener todos los artistas
- `GET /api/songs`: Obtener todas las canciones
- (Añade más endpoints a medida que los implementes)

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor haz un fork del repositorio y envía un pull request.
