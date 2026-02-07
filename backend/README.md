# Praktiline-too  Backend

Go-based REST API for praktiline-too application.

## Quick Start

1. **Setup environment**
   ```bash
   cp .env.example .env
   ```

2. **Start services**
   ```bash
   docker compose up -d
   ```

3. **Run application**
   ```bash
   go run main.go
   ```

## Requirements

- Go 1.23+
- Docker & Docker Compose
- PostgreSQL (via Docker)
- Redis (via Docker)

Default server runs on `http://localhost:8080`