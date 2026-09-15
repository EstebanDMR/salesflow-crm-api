# 🚀 SalesFlow CRM — Enterprise RESTful API

[![Node.js](https://img.shields.io/badge/Node.js-24_LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-7.8-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)
[![JWT](https://img.shields.io/badge/JWT-Secure_Auth-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io)
[![Render](https://img.shields.io/badge/Render-Live_API-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://salesflow-crm-api-n44y.onrender.com)
[![Swagger](https://img.shields.io/badge/Swagger-Live_Docs-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://salesflow-crm-api-n44y.onrender.com/api/docs)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Jest](https://img.shields.io/badge/Jest-100%25_Passing-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io)

> 🌐 **Live API URL:** [https://salesflow-crm-api-n44y.onrender.com](https://salesflow-crm-api-n44y.onrender.com)  
> 📖 **Swagger Docs:** [https://salesflow-crm-api-n44y.onrender.com/api/docs](https://salesflow-crm-api-n44y.onrender.com/api/docs)

Backend robusto, escalable y listo para producción para un **Customer Relationship Management (CRM)** comercial de alto rendimiento. Implementa autenticación segura mediante **JWT**, control de acceso granular basado en roles (**RBAC**), gestión del ciclo de vida de clientes, pipeline de leads, analítica de deals/ventas, agenda comercial de tareas, validaciones estrictas con **Zod**, observabilidad estructurada con **Pino**, capa de seguridad perimetral con **Helmet / CORS / Rate Limiting**, y documentación interactiva en **Swagger**.

---

## 📑 Tabla de Contenidos
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Stack Tecnológico](#-stack-tecnológico)
- [Diagrama Entidad-Relación (ER)](#-diagrama-entidad-relación-er)
- [Módulos y Endpoints](#-módulos-y-endpoints)
- [Seguridad y Observabilidad](#-seguridad-y-observabilidad)
- [Instalación y Configuración Local](#-instalación-y-configuración-local)
- [Ejecución con Docker](#-ejecución-con-docker)
- [Testing Automatizado](#-testing-automatizado)
- [Documentación Swagger OpenAPI](#-documentación-swagger-openapi)
- [Colección Postman](#-colección-postman)
- [Guía de Despliegue en Producción](#-guía-de-despliegue-en-producción)

---

## 🏛 Arquitectura del Proyecto

El proyecto sigue una arquitectura **Modular por Dominio (Feature-First Layered Architecture)** desacoplada y predecible:

```
salesflow-crm-api/
│ package.json
│ .env.example
│ .gitignore
│ .prettierrc
│ Dockerfile
│ docker-compose.yml
│ render.yaml
│ Procfile
│ SalesFlow_CRM_API.postman_collection.json
│ README.md
│
├── prisma/
│   ├── schema.prisma              # Definición de modelos, relaciones e índices
│   └── migrations/                # Historial de migraciones SQL
│
└── src/
    ├── config/                    # Configuración central (env, swagger, constants)
    │   ├── env.js
    │   └── swagger.js
    │
    ├── middlewares/               # Middlewares transversales
    │   ├── asyncHandler.js        # Wrapper de promesas para controladores
    │   ├── authorize.js           # Guardián de permisos RBAC
    │   ├── errorHandler.js        # Manejador global de excepciones
    │   ├── notFound.js            # Captura de rutas no encontradas (404)
    │   ├── protect.js             # Verificación y extracción de sesión JWT
    │   ├── rateLimiter.js         # Limitador perimetral (general y auth anti-brute-force)
    │   └── validate.js            # Middleware de validación con Zod (body, query, params)
    │
    ├── modules/                   # Módulos de dominio de negocio
    │   ├── auth/                  # Registro, login y perfil (me)
    │   ├── users/                 # Gestión administrativa de usuarios y roles
    │   ├── clients/               # CRUD de clientes con aislamiento por vendedor
    │   ├── leads/                 # Pipeline comercial y transiciones de estado
    │   ├── deals/                 # Negociaciones y métricas financieras de ingresos
    │   └── tasks/                 # Agenda comercial y recordatorios
    │
    ├── routes/                    # Agregador central de rutas de la API
    │   └── index.js
    │
    ├── utils/                     # Utilidades e instancias singleton
    │   ├── AppError.js            # Excepciones operacionales personalizadas
    │   ├── logger.js              # Logger Pino estructurado con tracking de latencia
    │   ├── prisma.js              # Cliente Prisma con adaptador PostgreSQL
    │   └── sendResponse.js        # Envoltorio de respuesta JSON unificada
    │
    ├── app.js                     # Configuración y middleware pipeline de Express
    └── server.js                  # Bootstrap del servidor y Graceful Shutdown
```

---

## 💻 Stack Tecnológico

| Capa | Tecnología | Justificación / Beneficio |
| :--- | :--- | :--- |
| **Runtime** | Node.js (v24 LTS) | Entorno de ejecución asíncrono no bloqueante |
| **Framework Web** | Express.js 5.x | Enrutamiento ligero, modular y robusto |
| **Base de Datos** | PostgreSQL 16 | Motor relacional ACID con integridad transaccional |
| **ORM** | Prisma 7.x + `@prisma/adapter-pg` | Type-safety, migraciones reproducibles y alta velocidad |
| **Autenticación** | JWT (JSON Web Tokens) | Autenticación stateless escalable |
| **Cifrado** | bcryptjs | Hashing unidireccional seguro de contraseñas |
| **Validación** | Zod | Validación tipada de schemas para body, params y query |
| **Seguridad** | Helmet + CORS + Rate Limit | Cabeceras HTTP seguras y protección DDoS/brute-force |
| **Logging** | Pino + Pino-HTTP | Logging estructurado JSON de alto rendimiento con tracking de latencia |
| **Docs API** | Swagger UI + OpenAPI 3.0 | Especificación viva y documentación interactiva |
| **Pruebas** | Jest + Supertest | Suite de pruebas de integración e infraestructura |
| **Contenedores** | Docker + Docker Compose | Empaquetado inmutable multi-stage para dev y producción |

---

## 📊 Diagrama Entidad-Relación (ER)

```mermaid
erDiagram
    USER ||--o{ CLIENT : "owns"
    USER ||--o{ LEAD : "assigned_to"
    USER ||--o{ DEAL : "manages"
    USER ||--o{ TASK : "assigned_to"
    CLIENT ||--o{ DEAL : "has"

    USER {
        int id PK
        string name
        string email UK
        string password
        string role "admin | manager | sales"
        datetime createdAt
        datetime updatedAt
    }

    CLIENT {
        int id PK
        string companyName
        string contactName
        string email
        string phone
        int ownerId FK
        datetime createdAt
        datetime updatedAt
    }

    LEAD {
        int id PK
        string name
        string source
        string status "new | contacted | qualified | lost | won"
        int userId FK
        datetime createdAt
        datetime updatedAt
    }

    DEAL {
        int id PK
        string title
        float value
        string stage "lead | contacted | proposal | negotiation | won | lost"
        datetime closeDate
        int clientId FK
        int userId FK
        datetime createdAt
        datetime updatedAt
    }

    TASK {
        int id PK
        string title
        string description
        boolean completed
        datetime dueDate
        int userId FK
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🛣 Módulos y Endpoints

Todos los endpoints (excepto Health y Registro/Login) requieren cabecera `Authorization: Bearer <TOKEN>`.

### 1. Sistema y Salud
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Público | Información de la API y enlaces |
| `GET` | `/api/health` | Público | Estado operativo, uptime y timestamp |
| `GET` | `/api/docs` | Público | Interfaz interactiva de Swagger UI |

### 2. Autenticación (`/api/auth`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Público | Registra usuario (valida email, pass min 6 chars) |
| `POST` | `/api/auth/login` | Público | Inicia sesión y genera token JWT |
| `GET` | `/api/auth/me` | Autenticado | Obtiene perfil del usuario logueado con conteo de métricas |

### 3. Usuarios y Permisos (`/api/users`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin, Manager | Lista usuarios con paginación y filtro por rol |
| `GET` | `/api/users/:id` | Admin, Manager | Detalle del usuario |
| `PATCH`| `/api/users/:id/role` | Admin | Actualiza rol (`admin`, `manager`, `sales`) |
| `DELETE`| `/api/users/:id` | Admin | Elimina cuenta de usuario (con protección de auto-eliminación) |

### 4. Clientes (`/api/clients`)
*Regla de Negocio:* El rol `sales` solo visualiza y modifica clientes de su propiedad (`ownerId`). `manager` y `admin` tienen acceso global.
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/clients` | Admin, Manager, Sales | Lista clientes (paginación, búsqueda por empresa/contacto) |
| `GET` | `/api/clients/:id` | Admin, Manager, Sales | Detalle del cliente e historial de deals vinculados |
| `POST` | `/api/clients` | Admin, Manager, Sales | Crea nuevo cliente |
| `PUT` | `/api/clients/:id` | Admin, Manager, Sales | Actualiza información del cliente |
| `DELETE`| `/api/clients/:id` | Admin, Manager, Sales | Elimina cliente |

### 5. Leads Pipeline (`/api/leads`)
*Estados válidos:* `new` ➔ `contacted` ➔ `qualified` ➔ `won` / `lost`
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/leads` | Admin, Manager, Sales | Lista pipeline con filtros por estado y fuente |
| `GET` | `/api/leads/:id` | Admin, Manager, Sales | Detalle del lead |
| `POST` | `/api/leads` | Admin, Manager, Sales | Registra nuevo lead |
| `PATCH`| `/api/leads/:id/status` | Admin, Manager, Sales | **Avanza/cambia estado en el pipeline comercial** |
| `PUT` | `/api/leads/:id` | Admin, Manager, Sales | Edición completa del lead |
| `DELETE`| `/api/leads/:id` | Admin, Manager, Sales | Elimina lead |

### 6. Deals & Analítica Comercial (`/api/deals`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/deals/stats` | Admin, Manager, Sales | **Métricas financieras: Total Revenue, Won Deals, Pending Deals, Win Rate % y desglose por etapa** |
| `GET` | `/api/deals` | Admin, Manager, Sales | Lista de deals con filtros por etapa, valor y cliente |
| `GET` | `/api/deals/:id` | Admin, Manager, Sales | Detalle del deal con datos de cliente y comercial |
| `POST` | `/api/deals` | Admin, Manager, Sales | Registra oportunidad comercial asociada a un cliente |
| `PUT` | `/api/deals/:id` | Admin, Manager, Sales | Actualiza valor, etapa o fecha estimada de cierre (`closeDate`) |
| `DELETE`| `/api/deals/:id` | Admin, Manager, Sales | Elimina deal |

### 7. Agenda Comercial de Tareas (`/api/tasks`)
| Método | Endpoint | Roles | Descripción |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks/my` | Admin, Manager, Sales | Tareas del usuario autenticado ordenadas por urgencia |
| `GET` | `/api/tasks` | Admin, Manager, Sales | Lista tareas con filtros por completitud y fecha límite |
| `GET` | `/api/tasks/:id` | Admin, Manager, Sales | Detalle de tarea |
| `POST` | `/api/tasks` | Admin, Manager, Sales | Programa tarea comercial con fecha límite (`dueDate`) |
| `PATCH`| `/api/tasks/:id/toggle`| Admin, Manager, Sales | Alterna estado completada / pendiente |
| `PUT` | `/api/tasks/:id` | Admin, Manager, Sales | Actualiza datos de la tarea |
| `DELETE`| `/api/tasks/:id` | Admin, Manager, Sales | Elimina tarea |

---

## 🔒 Seguridad y Observabilidad

1. **Protección Anti-Fuerza Bruta**: Rate limiting estricto (15 req / 15 min) en `/api/auth/login` y `/api/auth/register`, y 100 req / 15 min para el resto de la API.
2. **Cabeceras HTTP Seguras**: `helmet()` previene ataques XSS, Clickjacking, MIME sniffing y desactiva cabeceras informativas de fingerprinting.
3. **CORS Configurable**: Control de dominios autorizados mediante variable de entorno `CORS_ORIGIN`.
4. **Validación Exhaustiva con Zod**: Rechazo de payloads maliciosos o mal estructurados en frontera antes de alcanzar la capa de servicio.
5. **Observabilidad con Pino**: Logging estructurado con `responseTime`, código de estado, método, URL, IP e ID de solicitud para auditoría y trazabilidad en producción.
6. **Manejo Centralizado de Errores**: Captura de errores Prisma (`P2002` llave duplicada, `P2025` registro no encontrado), tokens expirados y excepciones operacionales con envelopes limpios y seguros.

---

## ⚙️ Instalación y Configuración Local

### Prerrequisitos
- **Node.js**: v20+ (recomendado v24 LTS)
- **PostgreSQL**: v14+ (o instancia remota en Supabase, Neon o Render)

### 1. Clonar el repositorio
```bash
git clone https://github.com/EstebanDMR/salesflow-crm-api.git
cd salesflow-crm-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://usuario:password@localhost:5432/salesflow_crm?schema=public"
JWT_SECRET="clave_secreta_super_segura_para_firmar_tokens"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="*"
```

### 4. Generar cliente Prisma y sincronizar base de datos
```bash
npm run db:generate
npm run db:push
```

### 5. Iniciar en modo desarrollo
```bash
npm run dev
```
La API quedará escuchando en `http://localhost:5000`.

---

## 🐳 Ejecución con Docker

Puedes levantar el stack completo (Base de Datos PostgreSQL + API) con un solo comando:

```bash
docker-compose up --build
```
- API disponible en: `http://localhost:5000`
- Documentación Swagger en: `http://localhost:5000/api/docs`
- PostgreSQL escuchando en puerto: `5432`

---

## 🧪 Testing Automatizado

La suite de pruebas con **Jest** y **Supertest** cubre salud del sistema, validaciones de esquema, protección de endpoints y reglas de acceso RBAC:

```bash
# Ejecutar suite de pruebas
npm test

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage
```

---

## 📖 Documentación Swagger OpenAPI

La documentación interactiva en vivo en producción está disponible en:
👉 **[https://salesflow-crm-api-n44y.onrender.com/api/docs](https://salesflow-crm-api-n44y.onrender.com/api/docs)**

En entorno local, disponible al correr el servidor en:
👉 **`http://localhost:5000/api/docs`**

También puedes obtener la especificación OpenAPI 3.0 en formato JSON directamente en:
👉 **[https://salesflow-crm-api-n44y.onrender.com/api/docs/swagger.json](https://salesflow-crm-api-n44y.onrender.com/api/docs/swagger.json)** (o `http://localhost:5000/api/docs/swagger.json`)

---

## 📬 Colección Postman

El repositorio incluye el archivo listo para importar en Postman:
**`SalesFlow_CRM_API.postman_collection.json`**

### Características de la colección:
- **Gestión Automática de Token**: Al ejecutar `Register User` o `Login User`, un script de test guarda automáticamente el token JWT en la variable de colección `{{token}}`.
- **Bearer Token Inherited**: Todas las peticiones protegidas heredan la autenticación automáticamente.
- **Payloads Listos**: Ejemplos preconfigurados para cada endpoint de la API.

---

## 🚀 Guía de Despliegue en Producción

### 🌐 Despliegue Activo en Render
- **Live API URL:** [https://salesflow-crm-api-n44y.onrender.com](https://salesflow-crm-api-n44y.onrender.com)
- **Swagger Docs:** [https://salesflow-crm-api-n44y.onrender.com/api/docs](https://salesflow-crm-api-n44y.onrender.com/api/docs)
- **Health Check:** [https://salesflow-crm-api-n44y.onrender.com/api/health](https://salesflow-crm-api-n44y.onrender.com/api/health)

### Opción 1: Render (Recomendada con `render.yaml`)
1. Crea una cuenta en [Render.com](https://render.com).
2. Conecta tu repositorio de GitHub.
3. El archivo `render.yaml` aprovisionará automáticamente:
   - Una base de datos PostgreSQL gestionada.
   - El servicio web Node.js con sus variables de entorno inyectadas.

### Opción 2: Railway
1. Sube tu proyecto a Railway seleccionando `Deploy from GitHub repo`.
2. Añade un plugin de PostgreSQL.
3. Configura `DATABASE_URL` vinculada a la variable del plugin y define `JWT_SECRET`.
4. El archivo `Procfile` iniciará automáticamente el servicio.

### Opción 3: Servidor VPS (Ubuntu / Debian con PM2 o Docker)
```bash
git clone https://github.com/EstebanDMR/salesflow-crm-api.git
cd salesflow-crm-api
npm install --production
npx prisma generate
npx prisma migrate deploy
npm install -g pm2
pm2 start src/server.js --name "salesflow-api"
```

---

## 👤 Autor
**Esteban DMR** — [GitHub](https://github.com/EstebanDMR)

*SalesFlow CRM API — Diseñado con estándares profesionales de código limpio, seguridad y arquitectura escalable.*