# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Variable de entorno de Vite (se evalúa en build time)
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar un servidor estático para servir la SPA
RUN npm install -g serve

# Copiar el directorio compilado desde el stage anterior
COPY --from=builder /app/dist ./dist

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Comando por defecto
CMD ["serve", "-s", "dist", "-l", "3000"]
