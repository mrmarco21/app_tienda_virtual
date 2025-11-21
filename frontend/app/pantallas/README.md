# 🖥️ Pantallas - Guía de Organización

## 📁 Estructura de Carpetas

Esta carpeta contiene todas las pantallas de la aplicación, organizadas por tipo de usuario y acceso.

### 01_publicas/
**Pantallas accesibles sin autenticación**

- `Inicio.jsx` - Pantalla principal con catálogo de productos
- `DetalleProducto.jsx` - Detalles de un producto específico
- `Carrito.jsx` - Carrito de compras
- `ConfirmacionCompra.jsx` - Formulario de confirmación de compra

**Características:**
- ✅ Acceso sin login
- ✅ Navegación desde tabs inferiores
- ✅ Funcionalidad de compra sin registro

**Flujo de navegación:**
```
Inicio → DetalleProducto → Carrito → ConfirmacionCompra
```

---

### 02_usuario/
**Pantallas para usuarios autenticados**

- `Perfil.jsx` - Perfil de usuario, login, registro y pedidos

**Características:**
- 🔐 Requiere autenticación (opcional)
- 📱 Acceso desde tab "Perfil"
- 👤 Gestión de cuenta y pedidos

**Estados de la pantalla:**
1. **Sin login**: Opciones de login/registro
2. **Con login**: Perfil, pedidos y opciones

---

### 03_admin/
**Pantallas para administradores**

- `PanelAdmin.jsx` - Dashboard principal de administración
- `GestionProductos.jsx` - Gestión de productos (CRUD)
- `FormularioProducto.jsx` - Crear/editar productos
- `GestionPedidos.jsx` - Gestión de pedidos
- `Reportes.jsx` - Reportes y estadísticas
- `DashboardAdmin.jsx` - Dashboard alternativo (no en uso)
- `LoginAdmin.jsx` - Login específico de admin (no en uso)

**Características:**
- 🔐 Requiere autenticación de admin
- 🛡️ Acceso solo para roles: admin, vendedor
- 📊 Herramientas de gestión completas

**Flujo de navegación:**
```
PanelAdmin → GestionProductos → FormularioProducto
           → GestionPedidos
           → Reportes
```

---

## 🎯 Descripción Detallada

### Inicio.jsx
**Pantalla principal del catálogo**

**Funcionalidades:**
- Listado de productos en grid
- Búsqueda de productos
- Filtrado por categorías
- Contador de carrito en header
- Pull to refresh

**Componentes usados:**
- `TarjetaProducto` - Para mostrar cada producto
- `useCarrito` - Context del carrito

---

### DetalleProducto.jsx
**Detalles completos de un producto**

**Funcionalidades:**
- Imagen grande del producto
- Información detallada
- Validación de stock
- Agregar al carrito
- Indicador de stock bajo

**Props recibidos:**
- `route.params.producto` - Objeto del producto

---

### Carrito.jsx
**Carrito de compras**

**Funcionalidades:**
- Lista de productos en carrito
- Modificar cantidades
- Eliminar productos
- Calcular total
- Validación de stock
- Botón de proceder al pago

**Context usado:**
- `useCarrito` - Gestión del carrito

---

### ConfirmacionCompra.jsx
**Formulario de compra**

**Funcionalidades:**
- Formulario de datos del cliente
- Selección de método de pago
- Resumen del pedido
- Validación de datos
- Creación del pedido
- Modal de confirmación

**Flujo:**
1. Llenar datos del cliente
2. Seleccionar método de pago
3. Confirmar pedido
4. Mostrar confirmación
5. Vaciar carrito

---

### Perfil.jsx
**Gestión de perfil y pedidos**

**Vistas:**
1. **Sin login**: Opciones de login/registro
2. **Login**: Formulario de inicio de sesión
3. **Registro**: Formulario de registro
4. **Autenticado**: Perfil, pedidos y opciones

**Funcionalidades:**
- Login de clientes
- Registro de usuarios
- Ver historial de pedidos
- Ver detalles de pedidos
- Cerrar sesión
- Acceso a panel admin (botón escudo)

**Componentes usados:**
- `FormularioLogin`
- `FormularioRegistro`
- `TarjetaPerfil`
- `ListaPedidos`
- `ModalLoginAdmin`
- `ModalDetallePedido`

---

### PanelAdmin.jsx
**Dashboard principal de administración**

**Funcionalidades:**
- Estadísticas generales
- Acciones rápidas
- Pedidos recientes
- Navegación a otras secciones

**Componentes usados:**
- `EncabezadoPanelAdmin`
- `EstadisticasCompactas`
- `AccionesRapidas`
- `PedidosRecientes`

---

### GestionProductos.jsx
**Gestión de productos**

**Funcionalidades:**
- Listado de productos
- Búsqueda de productos
- Filtrado por categoría
- Crear nuevo producto
- Editar producto
- Eliminar producto
- Ver imagen del producto

**Navegación:**
- → `FormularioProducto` (crear/editar)

---

### FormularioProducto.jsx
**Crear o editar productos**

**Funcionalidades:**
- Formulario completo de producto
- Subir imagen desde galería/cámara
- Seleccionar categoría
- Validación de datos
- Crear producto nuevo
- Actualizar producto existente

**Componentes usados:**
- `SeccionImagen`
- `SeccionInformacion`
- `ModalCategorias`
- `BotonesAccion`
- `ToastNotification`

---

### GestionPedidos.jsx
**Gestión de pedidos**

**Funcionalidades:**
- Listado de pedidos
- Filtrado por estado
- Cambiar estado de pedidos
- Ver detalles completos
- Scroll automático a pedido específico
- Contador por estado

**Componentes usados:**
- `EncabezadoAdmin`
- `FiltrosPedidos`
- `TarjetaPedidoAdmin`
- `ModalCambiarEstado`
- `EstadoVacioPedidos`

---

### Reportes.jsx
**Reportes y estadísticas**

**Funcionalidades:**
- Estadísticas de ventas
- Filtrado por período
- Gráficos y métricas
- Productos más vendidos
- Análisis de pedidos

---

## 🔄 Flujos de Navegación

### Usuario Cliente:
```
Inicio → DetalleProducto → Carrito → ConfirmacionCompra
  ↓
Perfil (Login/Registro) → Ver Pedidos
```

### Usuario Admin:
```
Perfil → Login Admin → PanelAdmin
                          ↓
                    GestionProductos → FormularioProducto
                          ↓
                    GestionPedidos
                          ↓
                    Reportes
```

---

## 📝 Ejemplo de Navegación

```javascript
// Desde NavegacionSimple.jsx
navigation.navigate('Inicio');
navigation.navigate('DetalleProducto', { producto });
navigation.navigate('Carrito');
navigation.navigate('ConfirmacionCompra');
navigation.navigate('Perfil');
navigation.navigate('Admin'); // PanelAdmin
navigation.navigate('GestionProductos');
navigation.navigate('AgregarProducto'); // FormularioProducto
navigation.navigate('EditarProducto', { producto });
navigation.navigate('GestionPedidos', { pedidoId }); // opcional
navigation.navigate('Reportes');
```

---

## 🔐 Control de Acceso

### Pantallas Públicas (01_publicas/)
- ✅ Acceso sin autenticación
- ✅ Disponibles para todos

### Pantallas de Usuario (02_usuario/)
- ⚠️ Autenticación opcional
- ✅ Funcionalidad mejorada con login

### Pantallas de Admin (03_admin/)
- 🔒 Requiere autenticación
- 🔒 Solo roles: admin, vendedor
- 🔒 Validación en backend

---

## 💡 Tips para Desarrollo

1. **Usa el contexto de navegación** correctamente
2. **Valida permisos** antes de mostrar opciones de admin
3. **Maneja estados de carga** en todas las pantallas
4. **Implementa pull-to-refresh** donde sea apropiado
5. **Usa BackHandler** para controlar el botón atrás

---

**Última actualización**: Noviembre 2024
