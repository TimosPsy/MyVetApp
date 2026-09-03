# MyVet App – Backend API

REST API for the veterinary clinic application built with **ASP.NET Core / .NET 10**. Handles authentication, authorization, staff management, owners, and pets.

## 🛠️ Tech Stack
* **Framework:** ASP.NET Core Web API (.NET 10)
* **Database & ORM:** EF Core 10 & SQL Server 2022
* **Security:** JWT (capability-based policies), BCrypt password hashing
* **Tooling:** AutoMapper, Serilog, Swagger

## 🌐 Service Addresses
When running via Docker Compose, endpoints are mapped as follows:

| Service | Address | Credentials |
| :--- | :--- | :--- |
| **Swagger UI** | <http://localhost:8081/swagger> | — |
| **API Base** | `http://localhost:8081/api/v1` | — |
| **SQL Server** | `localhost:1437` | **SA:** `sa` / `SA_PASSWORD`<br>**App User:** `vet_app_user` / `DB_USER_PASSWORD` |

---

## 🐳 Running via Docker

The backend setup uses a one-shot **init / setup container** (`sql-setup`) for maximum isolation: it runs once before the API, provisions the database and a restricted login, then exits. The API never connects as `sa`.

### Startup Pipeline (Enforced automatically):
1. **`sqlserver`:** Spins up and runs health checks.
2. **`sql-setup`:** Runs once, executes `innit_db.sql` to dynamically provision the DB and `vet_app_user` (utilizing `sqlcmd -v`), then exits.
3. **`webapp`:** Connects securely using the restricted `vet_app_user` credentials.

### Quick Start:
```bash
cd .. # Go to repository root
cp .env.example .env
# Edit .env and set distinct strong passwords for SA_PASSWORD and DB_USER_PASSWORD
docker compose up --build -d webapp
```

* **Logs:** `docker compose logs -f webapp` (or `sql-setup` for DB initialization logs).
* **Stop:** `docker compose stop webapp`
* **Hard Reset:** `docker compose down -v` (Wipes the volume; DB setup and EF migrations re-run on next start).

---

## 🔄 Database Migrations & Seeding
* **Schema:** Applied automatically on startup via `context.Database.Migrate()`.
* **Seed Scripts:** Idempotent scripts (`IF NOT EXISTS`) populate system metadata (Roles/Capabilities) from `Resources/db/`.
* **User Accounts:** **No application users are auto-generated**. You must manually trigger the staff registration endpoint to create the first admin.

---

## 🔐 Auth Flow
1. **Register:** `POST /api/v1/auth/register/staff` (Anonymous in development; requires `roleId` 1=ADMIN, 2=EMPLOYEE, 3=OWNER).
2. **Login:** `POST /api/v1/auth/login` ➡️ Returns a signed JWT.
3. **Authorize:** Paste the token into Swagger UI under **Authorize** as `Bearer <token>`. Endpoints are restricted via dedicated capability policies.

---

## 💻 Local Development (Without Docker)

### Prerequisites:
* **.NET 10 SDK** installed locally.
* Spin up only the DB infrastructure: `docker compose up -d sql-setup` (pulls in `sqlserver` via `depends_on`, provisions `vet_app_user`, then exits).

### Connection String:
The `DevConnection` string in `MyVetApp/appsettings.Development.json` is used when `ASPNETCORE_ENVIRONMENT=Development`. It targets the `vet_app_user` login and follows this shape:
```
Server=localhost,1437;Database=MyVetMVCDB;User=vet_app_user;Password=<DB_USER_PASSWORD>;TrustServerCertificate=True;MultipleActiveResultSets=true;
```
* Replace `<DB_USER_PASSWORD>` with the value you set in the root `.env` before `sql-setup` ran. Keep this file out of commits, or override it locally via user-secrets / the `ConnectionStrings__DevConnection` environment variable instead of editing it in place.
* `MultipleActiveResultSets=true` is required by the app's EF Core + raw-SQL execution pattern and mirrors the container connection string.
* If you started only `sqlserver` (no `sql-setup`), either run `sql-setup`, execute `Resources/db/innit_db.sql` manually, or point the string at `sa` / your `SA_PASSWORD`.

### Launch:
```bash
cd MyVetApp
dotnet run
```
* API hosts on `http://localhost:5123`
* Swagger UI accessible at <http://localhost:5123/swagger>

---

## ⚠️ Limitations & Disclaimers
* Project designed for academic/local environments.
* `register/staff` is open (anonymous admin registration).
* HTTPS redirection is enabled in code while the container serves HTTP only.
* Dev connection string and passwords are committed in `appsettings.Development.json` / `.env.example`.
* Automated tests, externalized secrets vaults, and CI/CD pipelines are pending implementation.
