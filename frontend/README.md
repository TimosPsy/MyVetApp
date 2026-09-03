# MyVet App – Frontend

React single-page application (SPA) for the veterinary clinic system.

## 🛠️ Tech Stack
* **Core:** React 19, TypeScript, Vite 8, React Router
* **Forms & Validation:** React Hook Form + Zod
* **Styling & UI:** Tailwind CSS 4 (`@tailwindcss/vite`, no config file), shadcn/ui (Radix primitives), `lucide-react` icons, `next-themes` (dark mode)
* **Auth & State:** `jwt-decode`, `js-cookie`, Sonner (toasts)

## 🌐 Endpoints & Development URL
When running, the frontend interface is accessible at:
* **Development Server:** <http://localhost:5173>

---

## 🐳 Running via Docker

The frontend has no independent Compose file and is managed from the repository root.

### Quick Start (Full Stack):
```bash
cd .. # Go to repository root
docker compose up --build -d
```

* **Hot-Reloading:** The container bind-mounts `./frontend` using polling-based file watching (`CHOKIDAR_USEPOLLING=true`), allowing code edits to refresh instantly without container rebuilds.
* **API Connection:** `VITE_API_URL` is automatically injected by Compose, defaulting to `http://localhost:8081/api/v1`.

---

## 💻 Local Development (Without Docker Host)

### Prerequisites:
* **Node.js 22+** and npm installed locally.
* A running backend instance (either via `docker compose up -d webapp` or running the .NET host directly).

### Configuration Setup:
```bash
cp .env.example .env
# Windows (cmd): copy .env.example .env
```

`.env.example` ships with an empty `VITE_API_URL=""`. Set the target API base URL in your local `.env`:
```env
VITE_API_URL="http://localhost:8081/api/v1" # Use http://localhost:5123/api/v1 if the backend runs directly on the .NET host
```

### Launch Execution:
```bash
npm install
npm run dev
```

### Package Scripts:

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Starts Vite dev server with Hot Module Replacement (HMR) |
| `npm run build` | Compiles TypeScript (`tsc -b`) and bundles production build to `dist/` |
| `npm run preview` | Previews the compiled production build locally |
| `npm run lint` | Runs ESLint checks |

---

## 📂 Project Architecture

```text
src/
  ├── main.tsx      # App entry (mounts <App/>, providers)
  ├── App.tsx       # Router + route/guard wiring
  ├── index.css     # Tailwind entry + theme tokens
  ├── api/          # Fetch wrappers per resource (auth, users, owners, pets)
  ├── schemas/      # Zod validation schemas + inferred payload types
  ├── context/      # AuthProvider (login state, JWT decoding, capability parsing)
  ├── components/   # Shared layouts, ProtectedRoute, UI primitives (shadcn)
  ├── pages/        # Route screen view components
  ├── lib/          # shadcn helpers (cn() class merger)
  ├── utils/        # Cookie management helpers
  └── types/        # Global type definitions (also src/types.ts)
```
*Note: Path alias `@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.*.json`).*

---

## 🔐 Authentication & Guarded Routing
* **Token Storage:** Upon login, the signed JWT is saved into the `access_token` cookie (1-day expiration).
* **State Hydration:** `AuthProvider` decodes the token claims into a runtime `user` state object containing `role`, `capabilities`, and `ownerId`.
* **Route Protection:** Access control is managed via `ProtectedRoute`. Passing a `requiredCapability` prop (e.g., `VIEW_USERS`) dynamically blocks unauthorized navigation, routing unprivileged requests to `/unauthorized`.

---

## ⚠️ Limitations & Disclaimers
* Project designed for academic/local testing.
* Auth cookies omit the `secure` flag and use `SameSite=Lax` to facilitate local HTTP environment development.
* Token refresh mechanics are omitted; sessions terminate immediately upon cookie expiration.
