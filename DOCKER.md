# Despliegue con Docker - EXAUP

Esta guía te muestra cómo desplegar la aplicación EXAUP usando Docker.

## Requisitos previos

- Docker instalado (v20.10 o superior)
- Docker Compose instalado (v2.0 o superior)

## Archivos incluidos

- **Dockerfile** - Dockerfile que usa `serve` para servir la aplicación (Desarrollo/Producción ligera)
- **Dockerfile.nginx** - Dockerfile que usa Nginx (Recomendado para Producción)
- **docker-compose.yml** - Orquestación de contenedores con soportes para dev y prod
- **nginx.conf** - Configuración de Nginx para la SPA
- **.dockerignore** - Archivos excluidos del build

## Opciones de despliegue

### Opción 1: Con serve (Desarrollo/Producción ligera)

**Build de la imagen:**
```bash
docker build -t exaup-app:latest .
```

**Ejecutar contenedor:**
```bash
docker run -d -p 3000:3000 --name exaup-app exaup-app:latest
```

**Acceso:**
- Abre: http://localhost:3000

**Detener contenedor:**
```bash
docker stop exaup-app
docker rm exaup-app
```

---

### Opción 2: Con Docker Compose (Recomendado)

#### Desarrollo con serve:

**Iniciar:**
```bash
docker-compose --profile dev up -d
```

**Ver logs:**
```bash
docker-compose logs -f app-dev
```

**Detener:**
```bash
docker-compose --profile dev down
```

---

#### Producción con Nginx (Recomendado para production):

**Iniciar:**
```bash
docker-compose --profile prod up -d
```

**Ver logs:**
```bash
docker-compose logs -f app-prod
```

**Detener:**
```bash
docker-compose --profile prod down
```

**Acceso:**
- Abre: http://localhost (puerto 80)

---

### Opción 3: Nginx directamente (Sin compose)

**Build la imagen Nginx:**
```bash
docker build -f Dockerfile.nginx -t exaup-app-nginx:latest .
```

**Ejecutar contenedor:**
```bash
docker run -d -p 80:80 --name exaup-nginx exaup-app-nginx:latest
```

**Acceso:**
- Abre: http://localhost

---

## Verificar salud de la aplicación

### Con serve:
```bash
curl http://localhost:3000
```

### Con Nginx:
```bash
curl http://localhost/health
```

---

## Variables de entorno

Puedes agregar un archivo `.env` (no incluido en el docker build):

**En docker-compose.yml, agrega:**
```yaml
env_file:
  - .env
```

---

## Comparativa entre Dockerfile y Dockerfile.nginx

| Aspecto | Dockerfile (serve) | Dockerfile.nginx |
|--------|-------------------|-----------------|
| Tamaño | Más grande | Más compacto |
| Rendimiento | Bueno | Excelente ⭐ |
| Gzip | No | Sí |
| Cache Control | Básico | Completo |
| Configuración | Simple | Avanzada |
| Caso de uso | Dev/Testing | Producción ⭐ |

**Recomendación:** Usa `Dockerfile.nginx` para producción.

---

## Despliegue en producción (ejemplo)

### En un servidor Linux/Cloud:

1. **Clonar el repo:**
```bash
git clone <tu-repo>
cd EXAUP_V2
```

2. **Ejecutar con docker-compose:**
```bash
docker-compose --profile prod up -d
```

3. **Configurar reverse proxy (opcional - Nginx en el host):**

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

4. **SSL/HTTPS (recomendado):**

Usa Let's Encrypt con Certbot:
```bash
sudo certbot certonly --webroot -w /var/www/certbot -d tu-dominio.com
```

---

## Comandos útiles

**Ver imágenes:**
```bash
docker images | grep exaup
```

**Ver contenedores en ejecución:**
```bash
docker ps
```

**Ver todos los contenedores:**
```bash
docker ps -a
```

**Ver logs en tiempo real:**
```bash
docker-compose logs -f
```

**Limpiar recursos (cuidado!):**
```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes sin usar
docker image prune

# Eliminar todo (contenedores, imágenes, volúmenes)
docker system prune -a --volumes
```

---

## Solución de problemas

### El contenedor se detiene inmediatamente
```bash
docker logs exaup-app
# O con compose:
docker-compose logs app-dev
```

### Puerto 80/3000 ya en uso
```bash
# Cambiar puerto en docker-compose
ports:
  - "8080:3000"  # Usa 8080 en lugar de 3000
```

### Build falla por dependencias
```bash
# Eliminar cache del build
docker build --no-cache -t exaup-app:latest .
```

---

## Monitoreo

Ambos contenedores incluyen health checks. Verifica el estado:
```bash
docker inspect exaup-app --format='{{.State.Health.Status}}'
```

---

## Más información

- [Docker Docs](https://docs.docker.com/)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)
