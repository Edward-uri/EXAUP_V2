# EXAUP V2

Aplicación web desarrollada con React y TypeScript para gestionar y presentar la experiencia principal de EXAUP.

## Tecnologías

- React
- TypeScript
- Vite
- ESLint
- Docker
- Nginx
- Vercel

## Características técnicas

- frontend modular organizado en `src/`;
- configuración de compilación con Vite;
- despliegue preparado con Docker y Nginx;
- configuración compatible con Vercel;
- tipado estático con TypeScript;
- reglas de calidad y linting.

## Ejecución local

### Requisitos

- Node.js 18+
- npm

### Instalación

```bash
git clone https://github.com/Edward-uri/EXAUP_V2.git
cd EXAUP_V2
npm install
npm run dev
```

Para generar una versión de producción:

```bash
npm run build
```

## Docker

El repositorio incluye archivos para construir y ejecutar la aplicación con Docker y Nginx. Consulta `DOCKER.md` para el flujo específico del proyecto.

## Estructura

```
src/                # Componentes y lógica de la aplicación
public/             # Recursos públicos
Dockerfile          # Imagen de producción
Dockerfile.nginx    # Servidor Nginx
docker-compose.yml  # Orquestación local
vercel.json         # Configuración de Vercel
```

## Estado

Proyecto en evolución. Las funcionalidades específicas y decisiones de producto se documentarán conforme avance el desarrollo.

## Autor

Eduardo Uriel Chavez Diaz — [@Edward-uri](https://github.com/Edward-uri)
