# Tecnologías Emergentes Admin Panel

Aplicación basada en Laravel 12 + Inertia React + Filament.

Este README explica cómo preparar el entorno, configurar la base de datos, ejecutar el proyecto en desarrollo (con o sin SSR) y construir para producción.

## Requisitos

- PHP 8.4+
- Composer 2+
- Node.js 18+ y npm 9+
- Motor de base de datos (MySQL/MariaDB, PostgreSQL o SQLite)

Opcional:
- Redis (si desea usarlo como cache/cola; por defecto la app usa `database`)

## 1) Clonar e instalar dependencias

```bash
# Clonar el repo
git clone https://github.com/PipeHerreraL/tecnologias-emergentes-admin-panel.git
cd tecnologias-emergentes-admin-panel

# PHP
composer install

# JS/CSS
npm install
```

## 2) Configurar variables de entorno

Cree su archivo `.env` (si no existe) y configure la conexión a la BD. El proyecto ya incluye un `.env` de ejemplo; asegúrese de revisar estas claves:

```env
APP_NAME="Tecnologias Emergentes"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Base de datos
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tecnologias-emergentes
DB_USERNAME=root
DB_PASSWORD=

# Sesión/Cache/Cola
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database

# Vite
VITE_APP_NAME="${APP_NAME}"
```

Genere la clave de la aplicación si es necesario:

```bash
php artisan key:generate
```

Si cambia valores del `.env`, borre cache de configuración:

```bash
php artisan config:clear
```

## 3) Migraciones (y tablas de sesión/colas)

Ejecute las migraciones:

```bash
php artisan migrate
```

Para obtener datos de ejemplo y un usuario de prueba.

```bash
php artisan db:seed
```

El usuario de prueba es: `admin@example.com` / `password`.

En caso de no usar `db:seed`, cree un usuario manualmente con la ruta `/register`

La app usa `SESSION_DRIVER=database` y `QUEUE_CONNECTION=database`, lo cual crea tablas mediante migraciones incluidas. Si cambió el driver, ajuste según su preferencia.

## 4) Ejecutar en desarrollo

Hay dos formas principales:

- Desarrollo estándar (Laravel + Vite):

```bash
# Terminal 1: servidor PHP
php artisan serve

# Terminal 2: assets
npm run dev
```

- Desarrollo asistido por script (con logs y colas en paralelo):

```bash
composer run dev
```

Este script usa `concurrently` para levantar:
- php artisan serve
- queue:listen
- pail (logs)
- vite (npm run dev)

### (Opcional) SSR con Inertia

Para SSR (Server-Side Rendering) con Inertia:

```bash
composer run dev:ssr
```

Esto construye los bundles SSR (`npm run build:ssr`) y luego inicia:
- php artisan serve
- queue:listen
- pail
- inertia:start-ssr

## 5) Acceso y rutas principales

- Página de bienvenida: `/`
  - Autenticación:
  - React:
      - Login: `/login`
      - Registro: `/register`
  - Filament (admin PHP):
      - Login: `/admin/login`
  
  La autenticación por ambas rutas funciona para cualquier módulo

### Módulo React (requiere auth + verified)

- Dashboard: `/dashboard`
- Students: `/students`
- Teachers: `/teachers`
- Subjects: `/subjects`

### Módulo Filament (admin PHP requiere auth + verified)

- Dashboard: `/admin`
- Students: `/admin/students`
- Teachers: `/admin/teachers`
- Subjects: `/admin/subjects`

### API autenticada con Bearer Token (CRUD)

Prefijo `/api/v1` (requiere Bearer Token en header `Authorization`). No requiere CSRF.

- Auth (Obtención del bearer token) el body debe incluir `email` y `password`:
  - `POST /api/v1/login`
  - `POST /api/v1/logout`
  - `GET /api/v1/me`

- Students
  - `GET /api/v1/students`
  - `POST /api/v1/students`
  - `GET /api/v1students/{id}`
  - `PUT|PATCH /api/v1/students/{id}`
  - `DELETE /api/v1/students/{id}`
- Teachers
    - `GET /api/v1/teachers`
    - `POST /api/v1/teachers`
    - `GET /api/v1/teachers/{id}`
    - `PATCH /api/v1/teachers/{id}`
    - `DELETE /api/v1/teachers/{id}`
- Subjects
    - `GET /api/v1/subjects`
    - `POST /api/v1/subjects`
    - `GET /api/v1/subjects/{id}`
    - `PATCH /api/v1/subjects/{id}`
    - `DELETE /api/v1/subjects/{id}`

## 6) Construir para producción

Compilar assets:

```bash
npm run build
```

Opcional SSR:

```bash
npm run build:ssr
```

Asegúrese de configurar correctamente `APP_URL`, cachear configuración y rutas si lo desea:

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Sirva la app con su servidor web (Nginx/Apache) apuntando a `public/`. Configure permisos de `storage/` y `bootstrap/cache/` para el usuario del servidor.

## 7) Solución de problemas

- “No veo datos en las tablas”: verifique `.env` (DB_*), existencia de datos, y ejecute `php artisan config:clear` tras cambios.
- Error de conexión a BD: confirme host/puerto/credenciales y que la BD `tecnologias-emergentes` existe.
- 401 Unauthorized en API: verifique que incluye el Bearer Token correcto en el header `Authorization`.
- Vite no recompila: reinicie `npm run dev`. Si usa HTTPS local, configure Vite acorde.
- Email verificación: muchas rutas requieren `verified`. Verifique usuario o desactive temporalmente para pruebas (no recomendado en producción).

## 8) Estructura y tecnologías

- Backend: Laravel 12, Fortify, Inertia-Laravel
- Frontend: React (Inertia), Vite, TypeScript, Tailwind (estilos del Starter Kit)
- Admin PHP: Filament 4
- BD: MySQL por defecto en `.env`

## 9) Licencia

MIT
