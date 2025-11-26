# 🛒 Tienda Virtual Móvil

Sistema completo de comercio electrónico móvil con React Native y Node.js. Permite a los usuarios navegar productos, gestionar un carrito de compras y realizar pedidos desde dispositivos móviles.

## 🏗️ Estructura del Proyecto

```
Tienda_Virtual/
├── backend/                 # API REST con Node.js + Express + MySQL
│   ├── src/
│   │   ├── config/         # Configuración (DB, Cloudinary)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Middleware (Multer)
│   │   ├── routes/         # Rutas de la API
│   │   └── index.js        # Servidor principal
│   └── database.sql        # Script de base de datos
│
├── frontend/                # App móvil con React Native + Expo
│   ├── app/
│   │   ├── pantallas/      # Pantallas de la app
│   │   ├── componentes/    # Componentes reutilizables
│   │   ├── contexto/       # Context API (Carrito)
│   │   ├── servicios/      # Servicios de API
│   │   └── config/         # Configuración
│   └── App.js              # Punto de entrada
│
└── README.md               # Este archivo
```

## 🚀 Tecnologías

**Backend:**
- Node.js + Express.js
- MySQL
- Cloudinary (almacenamiento de imágenes)
- bcryptjs (encriptación)

**Frontend:**
- React Native + Expo
- React Navigation
- Axios
- Context API

## ✨ Características

**Para Clientes:**
- Catálogo de productos con búsqueda y filtros
- Carrito de compras
- Compra sin registro obligatorio
- Consulta de pedidos por email
- Gestión de perfil (opcional)

**Para Administradores:**
- Panel de administración completo
- Gestión de productos (CRUD con imágenes)
- Gestión de pedidos y estados
- Reportes y estadísticas

## ⚡ Inicio Rápido

### 1. Backend
```bash
cd backend
npm install
# Configura .env con tus credenciales de MySQL y Cloudinary
mysql -u root -p < database.sql
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
# Configura la IP del backend en app/config/api.config.js
npm start
```

### 3. Probar en tu celular
- Instala **Expo Go** desde Play Store o App Store
- Escanea el código QR que aparece en la terminal
- Asegúrate de estar en la misma red WiFi

📚 **Documentación detallada:** Ver `backend/README.md` y `frontend/README.md`

## 📡 API Principal

**Productos:** `GET /api/productos`, `POST /api/productos`, `PUT /api/productos/:id`  
**Pedidos:** `POST /api/pedidos`, `GET /api/pedidos`, `PUT /api/pedidos/:id/estado`  
**Usuarios:** `POST /api/usuarios/registro`, `POST /api/usuarios/login`

Ver documentación completa en `backend/README.md`

## 📂 Documentación por Módulo

- **`backend/README.md`** - Documentación del backend (API, endpoints, configuración)
- **`frontend/README.md`** - Documentación del frontend (instalación, configuración, estructura)
- **`frontend/app/componentes/README.md`** - Guía de componentes reutilizables
- **`frontend/app/pantallas/README.md`** - Guía de pantallas y navegación

## 🔧 Solución de Problemas

**Error de conexión al backend:**
- Verifica que el backend esté corriendo en el puerto 3000
- Verifica la IP configurada en `frontend/app/config/api.config.js`
- Asegúrate de estar en la misma red WiFi (si usas celular físico)

**La app no carga:**
- Limpia la caché: `npm start -- --clear`
- Reinstala dependencias: `rm -rf node_modules && npm install`

## 📄 Licencia

ISC

---

**Proyecto desarrollado como parte del curso de Taller de Aplicaciones Móviles**  
**DSI-VI - 2025**