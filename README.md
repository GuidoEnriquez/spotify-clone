# Spotify Clone

A full-stack Spotify clone application built with Node.js, Express, PostgreSQL, and Docker.

## Features

- **Backend API**: RESTful API for managing artists, songs, and albums.
- **Database**: PostgreSQL database for structured data storage.
- **Dockerized Environment**: easy setup and deployment using Docker Compose.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Docker](https://www.docker.com/) & Docker Compose
- [npm](https://www.npmjs.com/)

## Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd spotify-clone
    ```

2.  **Environment Variables**

    Create a `.env` file in the `backend` directory (if not already present, though typically this is gitignored) with your configuration.

    Example `.env`:

    ```env
    PORT=3000
    DB_USER=postgres
    DB_PASSWORD=password
    DB_HOST=localhost
    DB_NAME=spotify
    DB_PORT=5432
    ```

3.  **Start the Database**

    Use Docker Compose to spin up the PostgreSQL database and pgAdmin.

    ```bash
    docker-compose up -d
    ```

4.  **Install Backend Dependencies**

    Navigate to the backend directory and install dependencies.

    ```bash
    cd backend
    npm install
    ```

5.  **Run the Application**

    Start the backend server.

    ```bash
    npm run dev
    ```

    The server should now be running on `http://localhost:3000` (or your defined port).

## API Endpoints

- `GET /api/artists`: Get all artists
- `GET /api/songs`: Get all songs
- (Add more endpoints as you implement them)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
