# Frontend - Tienda Virtual Móvil

Aplicación móvil desarrollada con React Native y Expo para la Tienda Virtual.

## 🚀 Instalación

Las dependencias ya están instaladas. Si necesitas reinstalarlas:

```bash
npm install
```

## ⚙️ Configuración

### 1. Configurar la IP del Backend

Edita el archivo `app/servicios/api.js` y cambia la IP por la de tu computadora:

```javascript
const API_BASE_URL = 'http://TU-IP-LOCAL:3000/api';
```

Para encontrar tu IP:
- **Windows**: Abre CMD y ejecuta `ipconfig`, busca "Dirección IPv4"
- **Mac/Linux**: Abre Terminal y ejecuta `ifconfig`, busca "inet"

Ejemplo: `http://192.168.1.100:3000/api`

### 2. Asegúrate de que el Backend esté corriendo

```bash
cd ../backend
npm run dev
```

## 📱 Ejecutar la Aplicación

### En el mismo dispositivo (emulador o web)

```bash
npm start
```

Luego presiona:
- `w` para abrir en navegador web
- `a` para abrir en emulador Android
- `i` para abrir en simulador iOS (solo Mac)

### En tu celular físico

1. Instala la app **Expo Go** desde Play Store o App Store
2. Ejecuta `npm start`
3. Escanea el código QR con tu celular
4. **IMPORTANTE**: Tu celular y tu computadora deben estar en la misma red WiFi

## 📁 Estructura del Proyecto

```
frontend/
├── app/
│   ├── pantallas/
│   │   ├── Inicio.jsx              # Lista de productos
│   │   ├── DetalleProducto.jsx     # Detalle del producto
│   │   ├── Carrito.jsx             # Carrito de compras
│   │   ├── ConfirmacionCompra.jsx  # Formulario de compra
│   │   └── Perfil.jsx              # Perfil y pedidos
│   ├── componentes/
│   │   ├── TarjetaProducto.jsx     # Card de producto
│   │   └── Header.jsx              # Header
│   ├── contexto/
│   │   └── CarritoContext.js       # Estado global del carrito
│   ├── servicios/
│   │   └── api.js                  # Servicios de API
│   └── AppNavigator.jsx            # Navegación principal
├── App.js                          # Punto de entrada
└── package.json
```

## 🎯 Funcionalidades

- ✅ Ver catálogo de productos
- ✅ Buscar y filtrar por categoría
- ✅ Ver detalle de producto
- ✅ Agregar productos al carrito
- ✅ Modificar cantidades en el carrito
- ✅ Realizar pedido sin registro
- ✅ Consultar pedidos por email
- ✅ Navegación con tabs

## 🔧 Solución de Problemas

### Error de conexión al backend

1. Verifica que el backend esté corriendo en el puerto 3000
2. Verifica que la IP en `api.js` sea correcta
3. Verifica que tu firewall permita conexiones en el puerto 3000
4. Si usas celular físico, asegúrate de estar en la misma red WiFi

### La app no carga

1. Cierra Expo y vuelve a ejecutar `npm start`
2. Limpia la caché: `npm start -- --clear`
3. Reinstala dependencias: `rm -rf node_modules && npm install`

## 📱 Probar en Celular Físico

1. Conecta tu celular y computadora a la misma red WiFi
2. Ejecuta `npm start`
3. Abre Expo Go en tu celular
4. Escanea el código QR
5. La app se cargará en tu celular

## 🎨 Personalización

Los colores principales están definidos en cada archivo de pantalla. Para cambiarlos globalmente, busca:

- Color primario: `#2196F3` (azul)
- Color éxito: `#4CAF50` (verde)
- Color error: `#f44336` (rojo)

## 📦 Build para Producción

Para crear un APK o IPA:

```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

Necesitarás configurar EAS Build primero: https://docs.expo.dev/build/setup/
