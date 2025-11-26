# Frontend - Tienda Virtual Móvil

Aplicación móvil desarrollada con React Native y Expo.

## 🚀 Instalación

```bash
npm install
```

## ⚙️ Configuración

### 1. Configurar la IP del Backend

Edita `app/config/api.config.js` y cambia la IP por la de tu computadora:

```javascript
export const API_BASE_URL = 'http://TU-IP-LOCAL:3000/api';
```

**Encontrar tu IP:**
- **Windows:** `ipconfig` en CMD → busca "Dirección IPv4"
- **Mac/Linux:** `ifconfig` en Terminal → busca "inet"

Ejemplo: `http://192.168.1.100:3000/api`

### 2. Verificar que el Backend esté corriendo

```bash
cd ../backend
npm run dev
```

## 📱 Ejecutar la Aplicación

### En navegador web o emulador

```bash
npm start
```

Luego presiona:
- `w` para web
- `a` para Android
- `i` para iOS (solo Mac)

### En tu celular físico

1. Instala **Expo Go** (Play Store o App Store)
2. Ejecuta `npm start`
3. Escanea el código QR
4. **Importante:** Celular y PC deben estar en la misma red WiFi

## 📁 Estructura del Proyecto

```
frontend/
├── app/
│   ├── pantallas/           # Pantallas de la app
│   │   ├── 01_publicas/    # Inicio, Carrito, etc.
│   │   ├── 02_usuario/     # Perfil
│   │   └── 03_admin/       # Panel de administración
│   ├── componentes/         # Componentes reutilizables
│   │   ├── 01_basicos/     # Headers
│   │   ├── 02_tarjetas/    # Cards
│   │   ├── 03_listas/      # Listas
│   │   ├── 04_formularios/ # Forms
│   │   ├── 05_modales/     # Modals
│   │   └── 06_secciones/   # Secciones
│   ├── contexto/            # Context API (Carrito)
│   ├── servicios/           # Servicios de API
│   ├── config/              # Configuración
│   └── NavegacionSimple.jsx # Navegación principal
├── App.js                   # Punto de entrada
└── package.json
```

📚 **Documentación detallada:**
- `app/componentes/README.md` - Guía de componentes
- `app/pantallas/README.md` - Guía de pantallas

## 🎯 Funcionalidades

**Para Clientes:**
- Catálogo de productos con búsqueda y filtros
- Carrito de compras
- Compra sin registro
- Consulta de pedidos por email

**Para Administradores:**
- Gestión de productos (CRUD con imágenes)
- Gestión de pedidos
- Reportes y estadísticas

## 🔧 Solución de Problemas

### Error de conexión al backend

1. Verifica que el backend esté corriendo en puerto 3000
2. Verifica la IP en `app/config/api.config.js`
3. Verifica que estés en la misma red WiFi (celular físico)
4. Verifica el firewall de Windows

### La app no carga

```bash
# Limpiar caché
npm start -- --clear

# Reinstalar dependencias
rm -rf node_modules
npm install
```

## 📦 Build para Producción

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

Requiere configurar EAS Build: https://docs.expo.dev/build/setup/
