Consultorio Odontologico
Sistema backend para la gestión de un consultorio odontológico, desarrollado con NestJS. El proyecto integra módulos clínicos, administrativos, de inventario, autenticación y documentación de API para centralizar la operación del consultorio. [file:1][file:7][file:8]
Integrantes
Christian Cañar
Roberto Rocha
Hernán Varas
Descripción funcional
El sistema permite administrar información clave del consultorio odontológico, incluyendo pacientes, odontólogos, especialidades, citas, tratamientos, inventario, pagos, facturación, recetas, historiales clínicos y odontogramas. Parte de la información se maneja en PostgreSQL para módulos relacionales y parte en MongoDB para colecciones documentales como odontogramas y recetas. [file:7][file:15]
Además, el proyecto incorpora autenticación con JWT, validación global de datos y documentación automática con Swagger para facilitar pruebas e integración entre módulos. [file:1][file:8][file:16][file:17]
Tecnologías utilizadas
NestJS [file:1]
TypeORM [file:1]
PostgreSQL [file:1][file:7]
MongoDB [file:1][file:7]
Mongoose [file:1][file:7]
JWT [file:1][file:16][file:17]
Passport [file:1][file:16][file:20]
Swagger [file:1][file:8]
class-validator / class-transformer [file:1][file:8]
Estructura general
Según la estructura visible del proyecto, el backend está organizado por módulos funcionales dentro de `src/`, incluyendo autenticación, citas, consultorios, especialidades, facturas, historial clínico, horarios, inventario, notificaciones, odontograma, odontólogos, pacientes, pagos, permisos, recetas, roles, tipos de tratamiento, tratamientos y users. [file:15]
Instalación
1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd <NOMBRE_DEL_PROYECTO>
```
2. Instalar dependencias
```bash
npm install
```
Las dependencias del proyecto incluyen NestJS, TypeORM, Mongoose, JWT, Passport, Swagger, bcrypt y validadores, entre otras. [file:1]
3. Configurar variables de entorno
Crear un archivo `.env` en la raíz del proyecto con una configuración similar a la siguiente:
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
La aplicación toma configuración de PostgreSQL, MongoDB y JWT mediante variables de entorno cargadas con `@nestjs/config`. [file:7][file:16][file:17]
4. Ejecutar el proyecto
Modo desarrollo:
```bash
npm run start:dev
```
Modo producción:
```bash
npm run build
npm run start:prod
```
Los scripts de ejecución, compilación, lint y pruebas están definidos en `package.json`. [file:1]
Uso
Base URL
```text
http://localhost:3000
```
La aplicación expone sus endpoints en el puerto 3000 y publica la documentación Swagger en `/docs`. [file:8]
Verificar que la API está activa
```http
GET /
```
Respuesta esperada:
```json
{
  "status": "Online",
  "service": "rocha-consultorio-odontologico api",
  "version": "0.0.1",
  "date": "2026-06-28T00:00:00.000Z"
}
```
La ruta raíz devuelve un estado de servicio activo con nombre y versión de la API. [file:6]
Autenticación
El proyecto implementa autenticación con JWT usando `@nestjs/jwt`, `passport-jwt` y una estrategia que extrae el token desde el header `Authorization: Bearer <token>`. [file:1][file:17][file:20]
1. Registro de usuario
```http
POST /auth/register
```
Este endpoint registra un usuario nuevo y devuelve un `access_token` firmado. Durante el registro también se intenta enviar un correo de bienvenida y crear una notificación interna. [file:18][file:19]
Ejemplo de body:
```json
{
  "username": "admin",
  "email": "admin@consultorio.com",
  "password": "123456"
}
```
> El body exacto puede variar según el contenido final de `CreateUserDto` en el módulo `users`, por lo que este ejemplo debe ajustarse a la estructura real del DTO de usuarios.
2. Inicio de sesión
```http
POST /auth/login
```
El login usa `email` y `password`, valida la contraseña con `bcrypt` y devuelve un `access_token` JWT cuando las credenciales son correctas. [file:18][file:19]
Ejemplo de body:
```json
{
  "email": "admin@consultorio.com",
  "password": "123456"
}
```
Respuesta esperada:
```json
{
  "access_token": "tu_jwt_aqui"
}
```
3. Consumo de endpoints protegidos
Una vez obtenido el token, debe enviarse en el header:
```http
Authorization: Bearer tu_jwt_aqui
```
La estrategia JWT valida el token con la clave `JWT_SECRET` y agrega al request un usuario con `id`, `email` y `rol`. [file:17]
4. Roles y autorización
El proyecto también incluye un decorador de roles y un `RolesGuard` que valida si el rol del usuario autenticado está permitido para un endpoint determinado. [file:21][file:22]
Swagger
La documentación interactiva de la API está disponible en:
```text
http://localhost:3000/docs
```
Swagger se genera desde `main.ts` con `DocumentBuilder` y `SwaggerModule`. [file:8]
Endpoints principales
La siguiente tabla resume los endpoints principales verificados o inferidos a partir de la estructura modular del proyecto. La columna de autenticación debe ajustarse según la implementación final de guards en cada controlador.
Método	Ruta	Descripción	¿Requiere autenticación?
GET	`/`	Verifica que la API esté en línea	No [file:6]
POST	`/auth/login`	Inicia sesión y devuelve JWT	No [file:18][file:19]
POST	`/auth/register`	Registra usuario y devuelve JWT	No [file:18][file:19]
GET	`/docs`	Acceso a documentación Swagger	No [file:8]
CRUD	`/pacientes`	Gestión de pacientes	Por confirmar [file:15]
CRUD	`/odontologos`	Gestión de odontólogos	Por confirmar [file:15]
CRUD	`/especialidades`	Gestión de especialidades	Por confirmar [file:15]
CRUD	`/citas`	Gestión de citas	Por confirmar [file:15]
CRUD	`/users`	Gestión de usuarios	Probablemente sí, por confirmar [file:15][file:16]
CRUD	`/roles`	Gestión de roles	Probablemente sí, por confirmar [file:15][file:21][file:22]
CRUD	`/tratamientos`	Gestión de tratamientos	Por confirmar [file:15]
CRUD	`/tipos-tratamiento`	Gestión de tipos de tratamiento	Por confirmar [file:15]
CRUD	`/pagos`	Gestión de pagos	Por confirmar [file:15]
CRUD	`/facturas`	Gestión de facturas	Por confirmar [file:15]
CRUD	`/consultorios`	Gestión de consultorios	Por confirmar [file:15]
CRUD	`/horarios`	Gestión de horarios	Por confirmar [file:15]
CRUD	`/permisos`	Gestión de permisos	Probablemente sí, por confirmar [file:15][file:21][file:22]
CRUD	`/notificaciones`	Gestión de notificaciones	Por confirmar [file:15][file:16][file:19]
CRUD	`/inventario`	Gestión de inventario	Por confirmar [file:15]
CRUD	`/odontograma`	Gestión de odontogramas	Por confirmar [file:15][file:7]
CRUD	`/historial-clinico`	Gestión de historiales clínicos	Por confirmar [file:15]
CRUD	`/recetas`	Gestión de recetas	Por confirmar [file:15]
Bases de datos
PostgreSQL
Se utiliza para módulos relacionales del sistema, como pacientes, odontólogos, especialidades, citas, usuarios, roles, tratamientos, tipos de tratamiento, pagos, facturas, consultorios, horarios, permisos, notificaciones e inventario. La conexión se configura con `TypeOrmModule.forRoot(...)`. [file:7][file:15]
MongoDB
Se utiliza para colecciones documentales como odontogramas, historial clínico y recetas. La conexión se configura con `MongooseModule.forRoot(...)`. [file:7][file:15]
Scripts útiles
```bash
npm run start
npm run start:dev
npm run build
npm run start:prod
npm run lint
npm run test
npm run test:cov
```
Estos scripts están definidos en `package.json` para desarrollo, compilación, pruebas y linting. [file:1]
Recomendaciones para pruebas
Usar Swagger en `/docs` para pruebas rápidas de endpoints. [file:8]
Usar Postman para probar autenticación y consumo de rutas protegidas con JWT. [file:17][file:20]
Verificar primero `GET /` para confirmar que la API está activa. [file:6]
Confirmar las variables de entorno antes de ejecutar la aplicación, especialmente PostgreSQL, MongoDB y JWT. [file:7][file:16][file:17]
Estado del proyecto
El backend se encuentra organizado por módulos y combina persistencia relacional y documental para cubrir necesidades clínicas y administrativas del consultorio. La estructura visible del proyecto muestra una solución amplia, preparada para autenticación, notificaciones, inventario, documentación y operación clínica. [file:15][file:16][file:19]