# MyVet App – Backend API

REST API for the veterinary clinic application built with ASP.NET Core / .NET 10. Handles authentication, authorization, staff management, owners, and pets.

## Tech Stack

ASP.NET Core Web API (.NET 10) · EF Core 10 (code-first migrations) · SQL Server 2022 · JWT authentication with capability-based policies · BCrypt password hashing · AutoMapper · Serilog · Swagger.

## Service Addresses

When the application is started via the root Docker Compose orchestrator, the API services are exposed at:

| Service    | Address                                   |
| ---------- | ----------------------------------------- |
| Swagger UI | <http://localhost:8081/swagger>           |
| API base   | `http://localhost:8081/api/v1`            |
| SQL Server | `localhost:1437` — `sa` / `SA_PASSWORD`   |

## Running the Backend (Docker)

This project has no Compose file of its own — it is built and run from the orchestrator at
the repository root. To start **only** the backend (SQL Server + API, without the frontend):

```bash
cd ..                                 # repo root, where docker-compose.yml lives
cp .env.example .env                  # Windows: copy .env.example .env
# edit .env: set JWT_SECRET, and SA_PASSWORD == DB_USER_PASSWORD (both strong)
docker compose up --build -d webapp   # also starts sqlserver via depends_on
```

Stop with `docker compose stop webapp`; follow logs with `docker compose logs -f webapp`;
reset the database with `docker compose down -v` (migrations and seeds re-run on next start).

## Database Migrations & Seeding

On startup, the API container automatically applies pending EF Core migrations and runs the idempotent SQL seed scripts located in `MyVetApp/Resources/db/`.

⚠️ **Database User & Seeding Notes:**
- The SQL seed scripts strictly populate system metadata such as roles, capabilities, and their respective mappings. 
- **No application user accounts are created automatically.** You must manually register your first staff account via the registration endpoint to log into the system.
- The .NET application authenticates against SQL Server using `DB_USER` / `DB_USER_PASSWORD` from your root `.env`. Since `DB_USER` defaults to `sa`, **`DB_USER_PASSWORD` must be identical to `SA_PASSWORD`** or the API cannot connect.

## Authentication & Authorization

1. **Staff Registration:** `POST /api/v1/auth/register/staff` (Anonymous during development). Body payload requires: `username`, `email`, `password`, `firstname`, `lastname`, and `roleId` (`1`=ADMIN, `2`=EMPLOYEE, `3`=OWNER).
2. **Login:** `POST /api/v1/auth/login` - Returns a signed JWT.
3. **Usage:** In Swagger UI, click **Authorize** and paste your token, or pass it via the header `Authorization: Bearer <token>`.

The issued token carries the user's role and a `capability` claim per specific permission. Endpoints are guarded by targeted capability policies (e.g., `INSERT_PET`, `VIEW_USERS`). Refer to the Swagger UI for complete endpoint signatures and access control requirements.

## Local Development (Without Docker)

If you prefer to run the API on your host for active debugging (Visual Studio, JetBrains Rider, or plain `dotnet run`):

### Prerequisites
- **.NET 10 SDK** installed locally.
- A SQL Server instance. Simplest option is to run *just* the database container from the repo root:
  ```bash
  docker compose up -d sqlserver
  ```

### Connection string
`MyVetApp/appsettings.Development.json` holds the `DevConnection` string used when `ASPNETCORE_ENVIRONMENT=Development`. The Compose database only creates the `sa` login, so point the string at `sa` / your `SA_PASSWORD`:

```
Server=localhost,1437;Database=MyVetMVCDB;User=sa;Password=<SA_PASSWORD>;TrustServerCertificate=True
```

(or manually create the SQL login it currently references inside the container).

### Run
```bash
cd MyVetApp
dotnet run
```

The API listens on `http://localhost:5123` (see `Properties/launchSettings.json`), so Swagger is at <http://localhost:5123/swagger>. On startup it applies EF Core migrations and runs the seed scripts, exactly as the container does.

## Notes

Local/academic project, not production-hardened: `register/staff` is anonymous (anyone can create an admin), `appsettings.Development.json` holds a dev connection string, and HTTPS redirection is on while the container serves HTTP only.

**Not yet done:** automated tests, admin-gated staff registration, externalized secrets, CI/CD.

---
💡 *For instructions on spinning up the full-stack ecosystem (Frontend + Backend + DB) via Docker, please refer to the root [README.md](../README.md).*
