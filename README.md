# Consultorio Odontologico

Sistema backend para la gestión de un consultorio odontológico, desarrollado con NestJS. El proyecto integra módulos clínicos, administrativos, de inventario, autenticación y documentación de API para centralizar la operación del consultorio.

## Integrantes

- Christian Cañar
- Roberto Rocha
- Hernán Varas

## Descripción funcional

El sistema permite administrar información clave del consultorio odontológico, incluyendo pacientes, odontólogos, especialidades, citas, tratamientos, inventario, pagos, facturación, recetas, historiales clínicos y odontogramas.  
Parte de la información se maneja en PostgreSQL para módulos relacionales y parte en MongoDB para colecciones documentales (odontogramas, historiales clínicos, recetas).

El proyecto incorpora autenticación con JWT, validación global de datos y documentación automática con Swagger para facilitar pruebas e integración entre módulos.

## Tecnologías utilizadas

- NestJS
- TypeORM
- PostgreSQL
- MongoDB
- Mongoose
- JWT
- Passport
- Swagger
- class-validator / class-transformer

## Estructura general

El backend está organizado por módulos funcionales dentro de `src/`, incluyendo:

- `auth`
- `citas`
- `consultorios`
- `especialidades`
- `facturas`
- `historial-clinico`
- `horarios`
- `inventario`
- `mail`
- `notificaciones`
- `odontograma`
- `odontologos`
- `pacientes`
- `pagos`
- `permisos`
- `recetas`
- `roles`
- `tipos-tratamiento`
- `tratamientos`
- `users`

## Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con una configuración similar:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=tu_password
DB_NAME=consultorio_odontologico
DB_SSL=false

MONGO_URI=mongodb://localhost:27017/consultorio_odontologico

JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1d
```

### 4. Ejecutar el proyecto

Modo desarrollo:

```bash
npm run start:dev
```

Modo producción:

```bash
npm run build
npm run start:prod
```

## Uso

### Base URL

```text
http://localhost:3000
```

### Verificar que la API está activa

```http
GET /
```

Respuesta de ejemplo:

```json
{
  "status": "Online",
  "service": "rocha-consultorio-odontologico api",
  "version": "0.0.1",
  "date": "2026-06-28T00:00:00.000Z"
}
```

### Documentación Swagger

```text
http://localhost:3000/docs
```

---

## Autenticación

El proyecto implementa autenticación con JWT usando `@nestjs/jwt`, `passport-jwt` y un guard `JwtAuthGuard`.

### 1. Registro de usuario

```http
POST /auth/register
```

Registra un usuario nuevo y devuelve un `access_token` JWT. Durante el registro se envía un correo de bienvenida y se crea una notificación interna (según la configuración del módulo de mail y notificaciones).

**Body de ejemplo**  
(ajusta los campos a lo que tenga realmente tu `CreateUserDto`):

```json
{
  "username": "admin",
  "email": "admin@consultorio.com",
  "password": "123456"
}
```

### 2. Inicio de sesión

```http
POST /auth/login
```

**Body de ejemplo:**

```json
{
  "email": "admin@consultorio.com",
  "password": "123456"
}
```

**Respuesta de ejemplo:**

```json
{
  "access_token": "tu_jwt_aqui"
}
```

### 3. Consumo de endpoints protegidos

Para consumir endpoints protegidos, debes enviar el token en el header:

```http
Authorization: Bearer tu_jwt_aqui
```

La estrategia JWT agrega al request un objeto `user` con `id`, `email` y `rol`.

### 4. Roles

Existen un decorador `@Roles(...)` y un `RolesGuard` que permiten restringir ciertas rutas a roles específicos (por ejemplo, solo administradores). Asegúrate de aplicar estos guards en los controladores que deben ser administrados por rol.

---

## Endpoints principales (resumen)

> Ajusta la columna de autenticación según los guards que apliquen en tus controladores.

| Método | Ruta                  | Descripción                          | ¿Auth?        |
| ------ | --------------------- | ------------------------------------ | ------------- |
| GET    | `/`                   | Health check de la API              | No            |
| POST   | `/auth/login`        | Login, devuelve JWT                 | No            |
| POST   | `/auth/register`     | Registro de usuario                 | No            |
| GET    | `/docs`              | Documentación Swagger               | No            |
| CRUD   | `/pacientes`         | Gestión de pacientes                | Sí (recomend.)|
| CRUD   | `/odontologos`       | Gestión de odontólogos              | Sí (recomend.)|
| CRUD   | `/especialidades`    | Gestión de especialidades           | Sí (recomend.)|
| CRUD   | `/citas`             | Gestión de citas                    | Sí (recomend.)|
| CRUD   | `/users`             | Gestión de usuarios                 | Sí            |
| CRUD   | `/roles`             | Gestión de roles                    | Sí            |
| CRUD   | `/permisos`          | Gestión de permisos                 | Sí            |
| CRUD   | `/tratamientos`      | Gestión de tratamientos             | Sí (recomend.)|
| CRUD   | `/tipos-tratamiento` | Catálogo de tipos de tratamiento    | Sí (recomend.)|
| CRUD   | `/inventario`        | Gestión de inventario               | Sí (recomend.)|
| CRUD   | `/pagos`             | Gestión de pagos                    | Sí (recomend.)|
| CRUD   | `/facturas`          | Gestión de facturas                 | Sí (recomend.)|
| CRUD   | `/consultorios`      | Gestión de consultorios             | Sí (recomend.)|
| CRUD   | `/horarios`          | Gestión de horarios                 | Sí (recomend.)|
| CRUD   | `/notificaciones`    | Gestión de notificaciones           | Sí (recomend.)|
| CRUD   | `/odontograma`       | Gestión de odontogramas             | Sí (recomend.)|
| CRUD   | `/historial-clinico` | Gestión de historiales clínicos     | Sí (recomend.)|
| CRUD   | `/recetas`           | Gestión de recetas                  | Sí (recomend.)|

---

## Bases de datos

### PostgreSQL

Usado para módulos relacionales: pacientes, odontólogos, especialidades, citas, usuarios, roles, tratamientos, tipos de tratamiento, pagos, facturas, consultorios, horarios, permisos, notificaciones, inventario.

### MongoDB

Usado para colecciones documentales: odontogramas, historial clínico, recetas.

---

## Scripts útiles

```bash
npm run start
npm run start:dev
npm run build
npm run start:prod
npm run lint
npm run test
npm run test:cov
```

---

## Recomendaciones para pruebas

- Probar primero `GET /` para confirmar que la API está arriba.
- Usar Swagger (`/docs`) para explorar endpoints.
- Usar Postman para probar login y consumo de rutas protegidas con JWT.
- Verificar que las variables de entorno de PostgreSQL, MongoDB y JWT estén correctas antes de levantar el servicio.