# 📦 Componentes

Componentes reutilizables organizados por tipo y función.

## 📁 Estructura

### 01_basicos/
**Headers y navegación**
- `EncabezadoAdmin.jsx` - Header genérico para admin
- `EncabezadoPanelAdmin.jsx` - Header del panel principal

### 02_tarjetas/
**Cards para mostrar información**
- `TarjetaProducto.jsx` - Card de producto
- `TarjetaPerfil.jsx` - Card de perfil
- `TarjetaPedido.jsx` - Card de pedido (cliente)
- `TarjetaPedidoAdmin.jsx` - Card de pedido (admin)

### 03_listas/
**Listas y estados vacíos**
- `ListaPedidos.jsx` - Lista de pedidos
- `EstadoVacioPedidos.jsx` - Estado vacío

### 04_formularios/
**Formularios de autenticación**
- `FormularioLogin.jsx` - Login
- `FormularioRegistro.jsx` - Registro

### 05_modales/
**Ventanas emergentes**
- `ModalLoginAdmin.jsx` - Login de admin
- `ModalDetallePedido.jsx` - Detalles de pedido
- `ModalCambiarEstado.jsx` - Cambiar estado
- `ModalCategorias.jsx` - Selector de categorías

### 06_secciones/
**Secciones y utilidades**
- `FiltrosPedidos.jsx` - Filtros
- `OpcionesPerfil.jsx` - Opciones de perfil
- `PedidosRecientes.jsx` - Pedidos recientes
- `AccionesRapidas.jsx` - Acciones rápidas
- `EstadisticasCompactas.jsx` - Estadísticas
- `BotonesAccion.jsx` - Botones de acción
- `SeccionImagen.jsx` - Subir/mostrar imágenes
- `SeccionInformacion.jsx` - Info de productos
- `ToastNotification.jsx` - Notificaciones

## 📝 Ejemplo de Uso

```javascript
import TarjetaProducto from '../../componentes/02_tarjetas/TarjetaProducto';
import FormularioLogin from '../../componentes/04_formularios/FormularioLogin';

<TarjetaProducto producto={producto} onPress={handlePress} />
<FormularioLogin onLogin={handleLogin} cargando={loading} />
```

## 🔍 Búsqueda Rápida

- **Producto** → `02_tarjetas/TarjetaProducto.jsx`
- **Login** → `04_formularios/FormularioLogin.jsx`
- **Header admin** → `01_basicos/EncabezadoAdmin.jsx`
- **Lista pedidos** → `03_listas/ListaPedidos.jsx`
- **Detalle pedido** → `05_modales/ModalDetallePedido.jsx`