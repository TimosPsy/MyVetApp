# MyVet App – Full-Stack Veterinary Clinic Management System

A full-stack web application for veterinary clinics, featuring role-based access control, fine-grained capability policies, automated database provisioning, and a decoupled SPA client. Built for local testing and academic evaluation.

## 🏗️ Architecture Overview

The system is split into three decoupled tiers orchestrated via **Docker Compose**:
* **Frontend:** A SPA built with **React 19, Vite 8, and Tailwind CSS 4**.
* **Backend API:** A REST API built with **ASP.NET Core / .NET 10**.
* **Database:** A **SQL Server 2022** instance, provisioned by a one-shot init container before the API starts.

---

## 🌐 Full-Stack Service Map

When running via the root Docker Compose, the ecosystem maps endpoints as follows:

| Component | Target URL | Exposed Port | Internal Port |
| :--- | :--- | :---: | :---: |
| **Frontend UI** | <http://localhost:5173> | `5173` | `5173` (HTTP) |
| **Backend API (Swagger)** | <http://localhost:8081/swagger> | `8081` | `8080` (HTTP) |
| **SQL Server Engine** | `localhost:1437` | `1437` | `1433` (TCP) |

---

## 🔐 Infrastructure Seeding (Least Privilege)

The database setup isolates administrative rights from application runtime execution:

```text
[Docker Compose]
  ├── sqlserver        # starts with the sa root account; healthcheck must pass
  │      └── ...
  ├── sql-setup        # one-shot init container: runs innit_db.sql, then exits
  │      └── creates 'MyVetMVCDB' + restricted 'vet_app_user' (password via sqlcmd -v)
  └── webapp           # .NET 10 API — starts only after sql-setup completes
         └── connects as 'vet_app_user', never as 'sa'
```

---

## 🚀 Quick Start (Docker Orchestration)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MyVetApp
```

### 2. Environment Configuration
Create your environment file at the repository root:
```bash
cp .env.example .env
# Windows (cmd): copy .env.example .env
```

### 3. Populate Secret Values
Open `.env` and assign distinct, strong values to the placeholders:
```env
JWT_SECRET=YOUR_SECURE_LONG_JWT_SECRET_KEY
SA_PASSWORD=YOUR_STRONG_SA_PASSWORD           # SQL Server container + sql-setup only; never used by the API
DB_USER_PASSWORD=YOUR_STRONG_DB_USER_PASSWORD # vet_app_user password — used by the webapp runtime connection
```
> `DB_USER_PASSWORD` must meet SQL Server's password policy (`CHECK_POLICY = ON` in `innit_db.sql`), or `sql-setup` fails.

### 4. Spin Up the Ecosystem
Launch all services simultaneously in detached mode:
```bash
docker compose up --build -d
```

### 🐳 Infrastructure Operations:
* **Global Cluster Logs:** `docker compose logs -f`
* **Target Component Logs:** `docker compose logs -f webapp` (or `sql-setup` / `frontend`)
* **Stop All Containers:** `docker compose stop`
* **Destructive Hard Reset:** `docker compose down -v` *(Wipes the `sqlserver-data` volume; `innit_db.sql`, EF Core migrations, and the `V00x` seed scripts all re-run on next boot).*

---

## 💻 Local Development Navigation (Without Docker)

If you prefer to run or debug the services natively on your host machine instead of running them containerized, follow the detailed setup guides located inside each subsystem's directory:

* 🖥️ **Frontend Local Setup:** For Node.js packages installation, Vite HMR tooling configurations, and script references, see [frontend/README.md](./frontend/README.md).
* ⚙️ **Backend Local Setup:** For .NET 10 SDK prerequisites, Local Connection String parameterisation, and native Entity Framework migrations, see [backend/README.md](./backend/README.md).

---

## 📂 Repository Topology

```text
📦 MyVetApp
 ├── 📄 docker-compose.yml     # Root orchestration manifest (sqlserver, sql-setup, webapp, frontend)
 ├── 📄 .env.example           # Shared environment variable template
 ├── 📄 README.md              # This file — full-stack overview & Docker quick start
 ├── 📂 frontend/              # React SPA (Vite 8 / Tailwind 4) + its own README
 └── 📂 backend/               # ASP.NET Core API, EF Core migrations, DB scripts + its own README
      └── 📂 MyVetApp/Resources/db/   # innit_db.sql (init container) + V00x seed scripts
```

---

## 🔒 Shared Security Disclaimers
* **Scope:** Tailored exclusively for local testing, educational code review, and academic evaluation.
* **Authentication:** Staff registration endpoints are anonymous in development mode.
* **Encryption:** Development environment TLS/HTTPS termination and client-side cookie `Secure` flags are loosened to ease zero-configuration local networking.
