# 🖥️ Pantallas

Pantallas de la aplicación organizadas por tipo de acceso.

## 📁 Estructura

### 01_publicas/
**Acceso sin autenticación**

- `Inicio.jsx` - Catálogo de productos
- `DetalleProducto.jsx` - Detalle de producto
- `Carrito.jsx` - Carrito de compras
- `ConfirmacionCompra.jsx` - Formulario de compra

**Flujo:** Inicio → DetalleProducto → Carrito → ConfirmacionCompra

### 02_usuario/
**Autenticación opcional**

- `Perfil.jsx` - Perfil, login, registro y pedidos

**Estados:**
- Sin login: Opciones de login/registro
- Con login: Perfil, pedidos y opciones

### 03_admin/
**Solo administradores**

- `PanelAdmin.jsx` - Dashboard principal
- `GestionProductos.jsx` - CRUD de productos
- `FormularioProducto.jsx` - Crear/editar productos
- `GestionPedidos.jsx` - Gestión de pedidos
- `Reportes.jsx` - Reportes y estadísticas

**Flujo:** PanelAdmin → GestionProductos/GestionPedidos/Reportes

---

## 📝 Descripción de Pantallas

### Inicio.jsx
Catálogo de productos con búsqueda, filtros por categoría y pull-to-refresh.

### DetalleProducto.jsx
Información completa del producto, validación de stock y agregar al carrito.

### Carrito.jsx
Lista de productos, modificar cantidades, calcular total y proceder al pago.

### ConfirmacionCompra.jsx
Formulario de datos del cliente, selección de método de pago y confirmación.

### Perfil.jsx
Gestión de perfil, login/registro, historial de pedidos y acceso a panel admin.

### PanelAdmin.jsx
Dashboard con estadísticas, acciones rápidas y pedidos recientes.

### GestionProductos.jsx
CRUD completo de productos con búsqueda y filtros.

### FormularioProducto.jsx
Crear/editar productos con subida de imágenes desde galería o cámara.

### GestionPedidos.jsx
Gestión de pedidos con filtros por estado y cambio de estados.

### Reportes.jsx
Estadísticas de ventas, productos más vendidos y análisis de pedidos.

## 🔄 Flujos de Navegación

**Cliente:**
```
Inicio → DetalleProducto → Carrito → ConfirmacionCompra
  ↓
Perfil → Ver Pedidos
```

**Admin:**
```
Perfil → Login Admin → PanelAdmin → GestionProductos/GestionPedidos/Reportes
```

## 📝 Navegación

```javascript
navigation.navigate('Inicio');
navigation.navigate('DetalleProducto', { producto });
navigation.navigate('Carrito');
navigation.navigate('ConfirmacionCompra');
navigation.navigate('Perfil');
navigation.navigate('Admin');
navigation.navigate('GestionProductos');
navigation.navigate('AgregarProducto');
navigation.navigate('EditarProducto', { producto });
navigation.navigate('GestionPedidos', { pedidoId });
navigation.navigate('Reportes');
```
