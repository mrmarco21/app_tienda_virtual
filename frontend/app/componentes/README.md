# 📦 Componentes - Guía de Organización

## 📁 Estructura de Carpetas

Esta carpeta contiene todos los componentes reutilizables de la aplicación, organizados por tipo y función.

### 01_basicos/
**Componentes básicos y fundamentales (Headers)**

- `Encabezado.jsx` - Header básico (comentado, no en uso)
- `EncabezadoAdmin.jsx` - Header genérico para pantallas de admin
- `EncabezadoPanelAdmin.jsx` - Header específico del panel principal de admin

**Cuándo usar:**
- Para headers de pantallas administrativas
- Cuando necesites un encabezado con navegación y acciones

---

### 02_tarjetas/
**Componentes de tipo tarjeta (Cards)**

- `TarjetaProducto.jsx` - Tarjeta para mostrar productos en el catálogo
- `TarjetaPerfil.jsx` - Tarjeta con información del perfil de usuario
- `TarjetaPedido.jsx` - Tarjeta de pedido para vista de cliente
- `TarjetaPedidoAdmin.jsx` - Tarjeta de pedido para vista de administrador

**Cuándo usar:**
- Para mostrar información resumida en formato de tarjeta
- En listas de productos, pedidos o perfiles

---

### 03_listas/
**Componentes de listas y estados vacíos**

- `ListaPedidos.jsx` - Lista completa de pedidos del usuario
- `EstadoVacioPedidos.jsx` - Estado vacío cuando no hay pedidos

**Cuándo usar:**
- Para mostrar colecciones de elementos
- Para estados vacíos con mensajes informativos

---

### 04_formularios/
**Componentes de formularios**

- `FormularioLogin.jsx` - Formulario de inicio de sesión
- `FormularioRegistro.jsx` - Formulario de registro de usuario

**Cuándo usar:**
- Para formularios de autenticación
- Cuando necesites capturar datos del usuario

---

### 05_modales/
**Componentes modales (ventanas emergentes)**

- `ModalLoginAdmin.jsx` - Modal de login para administradores
- `ModalDetallePedido.jsx` - Modal con detalles completos de un pedido
- `ModalCambiarEstado.jsx` - Modal para cambiar estado de pedidos
- `ModalCategorias.jsx` - Modal para seleccionar categorías

**Cuándo usar:**
- Para mostrar información adicional sin cambiar de pantalla
- Para confirmaciones y acciones importantes
- Para formularios secundarios

---

### 06_secciones/
**Componentes de secciones y utilidades**

#### Secciones de Información:
- `FiltrosPedidos.jsx` - Filtros para la lista de pedidos
- `OpcionesPerfil.jsx` - Opciones del menú de perfil
- `PedidosRecientes.jsx` - Sección de pedidos recientes
- `AccionesRapidas.jsx` - Botones de acciones rápidas
- `EstadisticasCompactas.jsx` - Tarjetas de estadísticas

#### Secciones de Formulario:
- `BotonesAccion.jsx` - Botones de acción para formularios
- `SeccionImagen.jsx` - Sección para subir/mostrar imágenes
- `SeccionInformacion.jsx` - Sección de información de productos

#### Utilidades:
- `ToastNotification.jsx` - Notificaciones toast

**Cuándo usar:**
- Para secciones específicas de pantallas
- Para componentes de utilidad general
- Para agrupaciones de elementos relacionados

---

## 🎯 Convenciones de Nombres

### Prefijos por Tipo:
- **Encabezado** - Headers y navegación
- **Tarjeta** - Cards y elementos de lista
- **Formulario** - Forms y inputs
- **Modal** - Ventanas emergentes
- **Estado** - Estados vacíos y placeholders
- **Lista** - Listas y colecciones

### Sufijos Comunes:
- **Admin** - Versión para administradores
- **Pedidos** - Relacionado con pedidos
- **Perfil** - Relacionado con perfil de usuario

---

## 📝 Ejemplo de Uso

```javascript
// Importar desde una pantalla
import TarjetaProducto from '../../componentes/02_tarjetas/TarjetaProducto';
import FormularioLogin from '../../componentes/04_formularios/FormularioLogin';
import ModalDetallePedido from '../../componentes/05_modales/ModalDetallePedido';

// Usar en el componente
<TarjetaProducto 
  producto={producto} 
  onPress={handlePress} 
/>

<FormularioLogin 
  onLogin={handleLogin}
  cargando={loading}
/>

<ModalDetallePedido
  visible={modalVisible}
  pedido={pedidoSeleccionado}
  onClose={handleClose}
/>
```

---

## 🔍 Búsqueda Rápida

**¿Necesitas un componente para...?**

- **Mostrar un producto** → `02_tarjetas/TarjetaProducto.jsx`
- **Login de usuario** → `04_formularios/FormularioLogin.jsx`
- **Header de admin** → `01_basicos/EncabezadoAdmin.jsx`
- **Lista de pedidos** → `03_listas/ListaPedidos.jsx`
- **Detalles de pedido** → `05_modales/ModalDetallePedido.jsx`
- **Filtros** → `06_secciones/FiltrosPedidos.jsx`
- **Estadísticas** → `06_secciones/EstadisticasCompactas.jsx`

---

## 💡 Tips

1. **Usa el autocompletado** de tu IDE para encontrar componentes
2. **Revisa los props** de cada componente antes de usarlo
3. **Mantén la consistencia** al crear nuevos componentes
4. **Documenta** los props y el uso de componentes complejos

---

**Última actualización**: Noviembre 2024
