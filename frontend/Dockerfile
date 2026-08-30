# syntax=docker/dockerfile:1
FROM node:22-alpine

WORKDIR /app

# Install deps first for layer caching. Full install (dev deps needed for Vite).
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest (superseded by the bind mount at run time, but keeps the
# image runnable on its own).
COPY . .

# Vite dev server needs to bind 0.0.0.0 to be reachable from the host.
EXPOSE 5173

# Polling makes file-watching / HMR reliable across the Docker bind mount
# (notably on Windows / WSL2 hosts).
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
