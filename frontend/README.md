# MyVet App – Frontend

React single-page app for the veterinary clinic system. Talks to the backend REST API for
auth, staff/user management, owners, and pets.

## Tech Stack

React 19 · TypeScript · Vite 8 · React Router · React Hook Form + Zod · Tailwind CSS 4 ·
shadcn/ui (Radix primitives) · `jwt-decode` · `js-cookie` · Sonner (toasts).

## Running the Frontend (Docker)

This project has no Compose file of its own — it is built and run from the orchestrator at
the repository root. From there:

```bash
docker compose up --build -d          # frontend + backend + database
```

The dev server is served at <http://localhost:5173>. The container bind-mounts `./frontend`
with polling-based file watching, so edits hot-reload without a rebuild. `VITE_API_URL` is
injected by Compose (defaults to `http://localhost:8081/api/v1`).

## Local Development (Without Docker)

### Prerequisites
- **Node.js 22+** and npm.
- A reachable backend API (run it via `docker compose up -d webapp` from the repo root, or
  locally — see [../backend/README.md](../backend/README.md)).

### Setup
```bash
cp .env.example .env        # Windows: copy .env.example .env
```

Set `VITE_API_URL` to the API base, including the version segment:

```
VITE_API_URL="http://localhost:8081/api/v1"
```

(Use `http://localhost:5123/api/v1` if you run the backend locally without Docker.)

### Run
```bash
npm install
npm run dev
```

Vite serves the app at <http://localhost:5173>.

### Scripts
| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR       |
| `npm run build`   | Type-check (`tsc -b`) and build to `dist/` |
| `npm run preview` | Serve the production build locally       |
| `npm run lint`    | Run ESLint                               |

## Project Structure

```
src/
  api/         fetch wrappers per resource (auth, users, owners, pets)
  schemas/     Zod schemas + inferred types for forms and API payloads
  context/     AuthProvider — login state, JWT decode, capability checks
  components/  shared components + ui/ (shadcn primitives)
  pages/       route screens
  utils/       cookie helpers
  types/       shared type declarations
```

Path alias: `@/` → `src/` (configured in `vite.config.ts` and `tsconfig`).

## Auth & Routing

- On login the API returns a JWT, stored in the `access_token` cookie (1-day expiry).
  `AuthProvider` decodes it into a `user` with `role`, `capabilities`, and `ownerId`.
- `ProtectedRoute` guards routes; pass `requiredCapability` (e.g. `VIEW_USERS`, `VIEW_PETS`)
  to gate on a specific capability. Unauthorized users are redirected to `/unauthorized`.
- Register a staff or owner account from the UI, or via the API — see the backend README.

## Notes

Local/academic project: the auth cookie is non-`secure` and `SameSite=Lax` for HTTP dev,
and there is no token refresh (the session ends when the cookie expires).

For full-stack setup (Frontend + Backend + DB) via Docker, see the root
[README.md](../README.md).
