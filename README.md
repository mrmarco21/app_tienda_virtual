# Tienda Virtual Móvil

Sistema completo de comercio electrónico móvil desarrollado con tecnologías modernas. Permite a los usuarios navegar productos, gestionar un carrito de compras y realizar pedidos desde dispositivos móviles sin necesidad de registro obligatorio.

## 🏗️ Arquitectura del Proyecto

```
Tienda_Virtual/
├── backend/                      # ✅ Backend Node.js + Express + MySQL + Cloudinary
│   ├── src/                     # Código fuente del backend
│   ├── .env                     # Variables de entorno
│   ├── package.json             # Dependencias del backend
│   └── database.sql             # Script de base de datos
├── frontend/                     # ✅ Frontend React Native + Expo
│   ├── app/                     # Código fuente del frontend
│   │   ├── pantallas/          # Pantallas de la app
│   │   ├── componentes/        # Componentes reutilizables
│   │   ├── contexto/           # Context API (Carrito)
│   │   ├── servicios/          # Servicios de API
│   │   └── AppNavigator.jsx    # Navegación
│   ├── App.js                   # Punto de entrada
│   └── package.json             # Dependencias del frontend
├── INICIO_RAPIDO.md             # ⚡ Guía de inicio rápido
├── CHECKLIST.md                 # ✅ Lista de verificación
├── COMANDOS_RAPIDOS.md          # 📝 Comandos útiles
├── RESUMEN_PROYECTO.md          # 📊 Resumen completo
├── DOCUMENTACION_TECNICA.md     # 📚 Documentación técnica
└── REQUISITOS_PRODUCTO.md       # 📋 Requisitos del producto
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MySQL** - Base de datos relacional
- **Cloudinary** - Almacenamiento de imágenes en la nube
- **Multer** - Middleware para manejo de archivos
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **React Native** - Framework para apps móviles
- **Expo** - Plataforma de desarrollo React Native
- **React Navigation** - Navegación entre pantallas
- **Axios** - Cliente HTTP para consumir API
- **Context API** - Gestión de estado global

## 📋 Características Principales

### ✅ Implementadas (Backend)
- ✅ Sistema completo de productos con imágenes
- ✅ Gestión de pedidos con detalles
- ✅ Sistema de usuarios con autenticación
- ✅ Subida de imágenes a Cloudinary
- ✅ API REST completa con validaciones
- ✅ Manejo de errores y transacciones
- ✅ Búsqueda y filtrado de productos
- ✅ Gestión de stock en tiempo real

### ✅ Implementadas (Frontend)
- ✅ Interfaz móvil con React Native + Expo
- ✅ Catálogo de productos con diseño atractivo
- ✅ Carrito de compras funcional
- ✅ Proceso de compra sin registro obligatorio
- ✅ Búsqueda y filtrado de productos
- ✅ Consulta de pedidos por email
- ✅ Navegación con tabs (Inicio, Carrito, Perfil)

### 🔄 Pendientes (Mejoras Futuras)
- 🔄 Panel de administración para vendedores
- 🔄 Sistema de notificaciones push
- 🔄 Sistema de favoritos
- 🔄 Reseñas y calificaciones

## ⚡ Inicio Rápido

**¿Primera vez?** Lee el archivo `INICIO_RAPIDO.md` para una guía paso a paso.

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**📱 En tu celular:** Instala "Expo Go" y escanea el código QR.

## 🚀 Instalación y Uso

### Backend
```bash
cd backend
npm install
# Configura tu .env con tus credenciales
cp .env.example .env
# Ejecuta el script SQL para crear la base de datos
mysql -u root -p < database.sql
# Inicia el servidor
npm run dev
```

### Frontend
```bash
cd frontend
# Configurar IP en app/servicios/api.js
npm start
# Presiona 'w' para web, 'a' para Android, 'i' para iOS
# O escanea el QR con Expo Go en tu celular
```

## 📡 Endpoints de la API

### Productos
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/buscar` - Buscar productos
- `GET /api/productos/categorias` - Obtener categorías
- `POST /api/productos` - Crear producto (con imagen)
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Pedidos
- `POST /api/pedidos` - Crear pedido con detalles
- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `PUT /api/pedidos/:id/estado` - Actualizar estado

### Usuarios
- `POST /api/usuarios/registro` - Registrar usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil/:email` - Obtener perfil

## 🔐 Seguridad

- Validación de entrada en todos los endpoints
- Sanitización de consultas SQL con prepared statements
- Encriptación de contraseñas con bcrypt
- Validación de tipos de archivo para imágenes
- Manejo de errores centralizado

## 🎯 Flujo de Compra

1. **Exploración**: El usuario navega por el catálogo de productos
2. **Selección**: Agrega productos al carrito
3. **Carrito**: Revisa y modifica su selección
4. **Compra**: Completa el formulario con sus datos
5. **Confirmación**: Recibe confirmación del pedido
6. **Seguimiento**: Puede ver el estado de su pedido

## 📱 Diseño Móvil

El frontend está diseñado con:
- **Mobile-first approach** - Optimizado para móviles
- **Bottom navigation** - Navegación intuitiva
- **Cards design** - Diseño de tarjetas para productos
- **Responsive layout** - Se adapta a diferentes tamaños
- **Touch-friendly** - Botones y elementos táctiles

## 🚀 Despliegue

### Backend (Railway/Render)
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Despliega automáticamente

### Frontend (Expo)
1. Build para Android/iOS
2. Publica en tiendas de apps
3. Actualizaciones Over-The-Air

## 📈 Próximas Mejoras

- Sistema de reseñas y calificaciones
- Pasarela de pago real (Stripe)
- Sistema de cupones y descuentos
- Notificaciones push
- Panel administrativo web
- Analytics y reportes
- Chat en tiempo real
- Sistema de favoritos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de características
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 📚 Documentación

Este proyecto incluye documentación completa:

- **`INICIO_RAPIDO.md`** - Guía de inicio rápido para comenzar en minutos
- **`CHECKLIST.md`** - Lista de verificación paso a paso
- **`COMANDOS_RAPIDOS.md`** - Comandos útiles para desarrollo
- **`RESUMEN_PROYECTO.md`** - Resumen completo del proyecto
- **`DOCUMENTACION_TECNICA.md`** - Documentación técnica detallada
- **`REQUISITOS_PRODUCTO.md`** - Requisitos y especificaciones
- **`backend/README.md`** - Documentación específica del backend
- **`frontend/README.md`** - Documentación específica del frontend
- **`frontend/CONFIG.md`** - Guía de configuración del frontend

## 📞 Soporte

Si tienes preguntas o encuentras problemas:
1. Revisa la documentación en los archivos `.md`
2. Consulta el `CHECKLIST.md` para verificar la configuración
3. Revisa los logs en las terminales del backend y frontend

---

**Proyecto desarrollado como parte del curso de Taller de Aplicaciones Móviles**  
**DSI-VI - 2025**