# 🛒 Consumo App - Plataforma de Compras Local

**Aplicación completa de e-commerce para agrupaciones de consumo local** con sistema de pagos simulados y billetera digital integrada.

## 📋 Tabla de Contenidos

- [🚀 Inicio Rápido](#-inicio-rápido)
- [✨ Características](#-características)
- [🔧 Arquitectura](#-arquitectura)
- [🔐 Seguridad](#-seguridad)
- [⚡ Mejoras Rev01](#-mejoras-rev01)
- [🏃‍♂️ Ejecución](#️-ejecución)
- [🧪 Testing](#-testing)
- [📊 Estructura del Proyecto](#-estructura-del-proyecto)
- [🛠️ Tecnologías](#️-tecnologías)
- [📚 API Documentation](#-api-documentation)
- [🤝 Contribución](#-contribución)

## 🚀 Inicio Rápido

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Hacer ejecutable el script de instalación
chmod +x setup.sh

# 2. Ejecutar setup completo (requiere Docker & Docker Compose)
./setup.sh

# 3. Abrir la aplicación
open http://localhost:5173
```

### Opción 2: Desarrollo Local

```bash
# Backend
cd backend
npm install
node init-db.js  # Inicializar base de datos
node index.js    # Servidor en puerto 5000

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev      # Servidor en puerto 5173
```

### 👤 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| `admin@example.com` | `adminpass` | Administrador |
| `user@example.com` | `userpass` | Usuario |

## ✨ Características

### 🛍️ **Para Usuarios**
- ✅ **Catálogo de productos** con filtros y búsqueda
- ✅ **Carrito persistente** (mantiene productos entre sesiones)
- ✅ **Checkout seguro** con múltiples métodos de pago
- ✅ **Historial de pedidos** con seguimiento
- ✅ **Interfaz responsive** para móvil y escritorio
- ✅ **Registro y autenticación** con JWT

### 👨‍💼 **Para Administradores**
- ✅ **Gestión de productos** (crear, editar, eliminar)
- ✅ **Gestión de proveedores** con información de contacto
- ✅ **Panel de órdenes** con detalles completos
- ✅ **Control de stock** en tiempo real
- ✅ **Dashboard administrativo** intuitivo

### 💳 **Sistema de Pagos**
- ✅ **Billetera digital** integrada con saldos
- ✅ **Simulador PayPal** para pruebas
- ✅ **Validación de fondos** antes del pago
- ✅ **Historial de transacciones**

## 🔧 Arquitectura

### 📡 **Servicios**

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **Frontend** | `5173` | React + Vite + Tailwind CSS |
| **API Backend** | `5000` | Node.js + Express + SQLite |
| **Payment Mock** | `4001` | Simulador de pagos PayPal |
| **Wallet Service** | `4100` | Servicio de billetera digital |

### 🗄️ **Base de Datos**

```sql
-- Estructura principal de tablas
users (id, name, email, password, role)
suppliers (id, name, contact)
products (id, name, category, price_cents, stock, supplier_id, image_url)
cart_items (id, session_id, user_id, product_id, qty, created_at)
orders (id, user_id, total_cents, created_at)
order_items (id, order_id, product_id, qty, unit_price_cents)
```

## 🔐 Seguridad

### 🛡️ **Medidas Implementadas**

- ✅ **Validación de entrada robusta** con express-validator
- ✅ **Autenticación JWT** con tokens seguros
- ✅ **Autorización por roles** (admin/user)
- ✅ **Sanitización de datos** de entrada
- ✅ **Protección CORS** configurada
- ✅ **Manejo seguro de contraseñas** con bcrypt
- ✅ **Validación de sesiones** y tokens expirados
- ✅ **Transacciones atómicas** para operaciones críticas

### 🔒 **Endpoints Protegidos**

- **Solo Admin**: Crear/editar/eliminar productos y proveedores
- **Autenticado**: Ver órdenes, gestionar carrito con usuario
- **Público**: Ver productos y proveedores, carrito anónimo

## ⚡ Mejoras Rev01

### 🎯 **Mejoras Prioritarias Implementadas**

#### 🔐 **Seguridad y Validación**
- **express-validator** integrado para validación robusta
- **Middleware JWT centralizado** con manejo de errores
- **Autorización por roles** para operaciones críticas
- **Validación de tipos, rangos y formatos** en todos los endpoints

#### 🛒 **Carrito Persistente**
- **Migrado de memoria a base de datos** (tabla cart_items)
- **Soporte para usuarios autenticados y anónimos** (session-based)
- **Verificación de stock en tiempo real**
- **Operaciones CRUD completas** con validaciones

#### ⚡ **Gestión de Stock Thread-Safe**
- **Transacciones SQLite atómicas** para prevenir race conditions
- **Verificación de stock** antes y durante compras
- **Rollback automático** en caso de errores
- **Consistency garantizada** en operaciones concurrentes

#### 🚨 **Manejo de Errores Robusto**
- **Middleware global** de manejo de errores
- **Respuestas estructuradas** con códigos HTTP apropiados
- **AsyncHandler wrapper** para funciones async
- **Manejo específico** de errores de BD y JSON malformado

#### 🏗️ **Refactorización de Código**
- **Rutas refactorizadas** con mejor legibilidad
- **Separación de responsabilidades** (middleware, validadores)
- **API responses consistentes** en toda la aplicación
- **Documentación mejorada** con comentarios explicativos

#### 🎨 **Mejoras Frontend**
- **Persistencia de sesión** con localStorage
- **Manejo de tokens expirados** automático
- **API centralizada** con manejo de errores
- **Estados de carga** durante inicialización

#### 🔗 **Integridad de Datos**
- **Verificación de relaciones** entre entidades
- **Constraints para prevenir eliminación** de recursos con dependencias
- **Validación de integridad referencial**
- **Transacciones para mantener consistencia**

## 🏃‍♂️ Ejecución

### 🐳 **Con Docker (Producción)**

```bash
# Setup completo
./setup.sh

# O manualmente:
docker compose build
docker compose run --rm api node init-db.js
docker compose up -d
```

### 💻 **Desarrollo Local**

```bash
# Terminal 1: Backend
cd backend
npm install
node init-db.js
node index.js

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev

# Terminal 3: Servicios auxiliares (opcional)
cd wallet && node service.js
cd payment-mock && node server.js
```

### 📦 **Scripts Disponibles**

```bash
# Backend
npm start          # Iniciar servidor
npm run init-db    # Reinicializar BD con datos seed

# Frontend
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
```

## 🧪 Testing

### 🔍 **Pruebas Manuales**

```bash
# Health check
curl http://localhost:5000/api/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"adminpass"}'

# Obtener productos
curl http://localhost:5000/api/products

# Añadir al carrito
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "X-Session-Id: test-session" \
  -d '{"productId":1,"qty":2}'
```

### ✅ **Casos de Prueba Cubiertos**
- ✅ Validación de entrada con datos inválidos
- ✅ Autenticación y autorización por roles  
- ✅ Carrito persistente entre sesiones
- ✅ Validación de stock y prevención de overselling
- ✅ Manejo de errores y respuestas estructuradas
- ✅ Integridad referencial en base de datos

## 📊 Estructura del Proyecto

```
consuo/
├── 📁 backend/                 # API Node.js + Express
│   ├── 📁 data/                # Base de datos SQLite
│   ├── 📁 middleware/          # Auth, validación, errores
│   ├── 📁 routes/              # Endpoints de la API
│   ├── 📁 validators/          # Validadores de entrada
│   ├── 📄 db.js                # Configuración de BD
│   ├── 📄 index.js             # Servidor principal
│   └── 📄 init-db.js           # Script de inicialización
├── 📁 frontend/                # React + Vite
│   ├── 📁 src/
│   │   ├── 📁 admin/           # Componentes de administración
│   │   ├── 📁 components/      # Componentes reutilizables
│   │   ├── 📁 pages/           # Páginas principales
│   │   ├── 📄 api.js           # Cliente API centralizado
│   │   └── 📄 App.jsx          # Componente principal
│   └── 📄 index.html
├── 📁 payment-mock/            # Simulador PayPal
├── 📁 wallet/                  # Servicio de billetera
├── 📄 docker-compose.yml      # Orquestación de servicios
├── 📄 setup.sh                # Script de instalación
└── 📄 README.md               # Este archivo
```

## 🛠️ Tecnologías

### 🖥️ **Backend**
- **Node.js** + **Express.js** - Servidor y API REST
- **SQLite** + **better-sqlite3** - Base de datos embebida
- **JWT** - Autenticación y autorización  
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de entrada
- **CORS** - Configuración de recursos cruzados

### 🎨 **Frontend**
- **React 18** - Biblioteca de UI
- **Vite** - Build tool y servidor de desarrollo
- **Tailwind CSS** - Framework de estilos
- **JavaScript ES6+** - Lenguaje principal

### 🐳 **DevOps**
- **Docker** + **Docker Compose** - Contenedores
- **Node.js 18** - Runtime
- **Git** - Control de versiones

## 📚 API Documentation

### 🔐 **Authentication**

```bash
# Login
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "adminpass"
}

# Register
POST /api/auth/register
{
  "name": "Usuario",
  "email": "usuario@example.com", 
  "password": "password123"
}
```

### 🛍️ **Products**

```bash
# Obtener productos (público)
GET /api/products

# Crear producto (admin)
POST /api/products
Authorization: Bearer {token}
{
  "name": "Producto",
  "category": "categoria",
  "price_cents": 1000,
  "stock": 50,
  "supplier_id": 1,
  "image_url": "https://..."
}
```

### 🛒 **Cart**

```bash
# Ver carrito
GET /api/cart
X-Session-Id: session-123

# Añadir al carrito
POST /api/cart
X-Session-Id: session-123
{
  "productId": 1,
  "qty": 2
}
```

### 📦 **Orders**

```bash
# Ver órdenes (autenticado)
GET /api/orders
Authorization: Bearer {token}

# Checkout
POST /api/orders/checkout
{
  "items": [{"productId": 1, "qty": 2}],
  "payment_method": "wallet",
  "wallet_email": "user@example.com"
}
```

## 🤝 Contribución

### 🚀 **Siguientes Mejoras Planificadas**

#### **Medio Plazo**
- [ ] **Paginación** en listados de productos y órdenes
- [ ] **Sistema de logging** estructurado
- [ ] **Tests unitarios** e integración
- [ ] **Caché de consultas** frecuentes
- [ ] **Índices de base de datos** para performance

#### **Largo Plazo**  
- [ ] **Notificaciones** push y email
- [ ] **Sistema de reviews** y ratings
- [ ] **Integración con APIs reales** de pago
- [ ] **Panel de analytics** avanzado
- [ ] **App móvil** React Native

### 📝 **Proceso de Contribución**

1. Fork del repositorio
2. Crear branch de feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -m 'feat: descripción'`
4. Push al branch: `git push origin feature/nueva-funcionalidad`
5. Crear Pull Request

---

## 📋 **Estado del Proyecto**

**✅ Rev01 - Mejoras Críticas Completadas**
- Seguridad, validación y manejo de errores implementados
- Carrito persistente y gestión thread-safe de stock  
- Código refactorizado y listo para desarrollo serio

**🎯 Próximo: Rev02 - Mejoras de Performance y UX**

---

## 📄 Licencia

Este proyecto está licenciado bajo la **GNU General Public License v3.0 (GPLv3)**.

Esto significa que:
- ✅ Puedes usar el software para cualquier propósito
- ✅ Puedes estudiar y modificar el código fuente
- ✅ Puedes redistribuir copias del software
- ✅ Puedes distribuir versiones modificadas
- ⚠️ **Todas las obras derivadas deben mantener la misma licencia GPLv3**
- ⚠️ **Debes incluir el código fuente al distribuir**

**📋 Texto completo de la licencia:** [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.html)

---

**💡 ¿Preguntas o problemas?** Abre un issue en GitHub o revisa la documentación de la API.

**🚀 ¡Happy Coding!**
