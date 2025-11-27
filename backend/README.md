# Backend - Tienda Virtual Móvil

API REST desarrollada con Node.js, Express, MySQL y Cloudinary.

## 🚀 Tecnologías

- **Node.js + Express.js** - Servidor y API REST
- **MySQL** - Base de datos relacional
- **Cloudinary** - Almacenamiento de imágenes
- **Multer** - Manejo de archivos
- **bcryptjs** - Encriptación de contraseñas
- **JWT** - Autenticación

## 📁 Estructura

```
backend/
├── src/
│   ├── config/          # Configuración (MySQL, Cloudinary)
│   ├── controllers/     # Lógica de negocio
│   ├── middleware/      # Middleware (Multer)
│   ├── routes/          # Rutas de la API
│   ├── app.js           # Configuración de Express
│   └── index.js         # Servidor principal
├── .env                 # Variables de entorno
├── database.sql         # Script de base de datos
└── package.json
```

## 🔧 Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

Edita `.env` con tus credenciales:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=tienda_virtual
CLOUD_NAME=tu_cloud_name
CLOUD_API_KEY=tu_api_key
CLOUD_API_SECRET=tu_api_secret
JWT_SECRET=mi_secreto_super_secreto
```

### 3. Crear base de datos
```bash
mysql -u root -p < database.sql
```

### 4. Iniciar servidor
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📡 Endpoints de la API

### Productos
```
GET    /api/productos                    # Listar todos
GET    /api/productos/buscar             # Buscar (query: q, categoria)
GET    /api/productos/categorias         # Obtener categorías
GET    /api/productos/:id                # Obtener por ID
POST   /api/productos                    # Crear (con imagen)
PUT    /api/productos/:id                # Actualizar
DELETE /api/productos/:id                # Eliminar
```

### Pedidos
```
POST   /api/pedidos                      # Crear pedido
GET    /api/pedidos                      # Listar todos
GET    /api/pedidos/:id                  # Obtener por ID
GET    /api/pedidos/usuario/:email       # Obtener por email
PUT    /api/pedidos/:id/estado           # Actualizar estado
```

### Usuarios
```
POST   /api/usuarios/registro            # Registrar usuario
POST   /api/usuarios/login               # Iniciar sesión
GET    /api/usuarios/perfil/:email       # Obtener perfil
PUT    /api/usuarios/perfil/:id          # Actualizar perfil
PUT    /api/usuarios/cambiar-password/:id # Cambiar contraseña
```

## 📋 Ejemplos de Uso

### Crear un producto con imagen
```bash
curl -X POST http://localhost:3000/api/productos \
  -F "nombre=Smartphone Samsung" \
  -F "categoria=Electrónica" \
  -F "precio=899.99" \
  -F "stock=25" \
  -F "descripcion=Teléfono inteligente" \
  -F "imagen=@/ruta/imagen.jpg"
```

### Crear un pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_cliente": "Luis Mendoza",
    "email": "luis@gmail.com",
    "direccion": "Jr. Amazonas 453",
    "total": 259.80,
    "metodo_pago": "Yape",
    "productos": [
      {"producto_id": 1, "cantidad": 2, "subtotal": 199.8}
    ]
  }'
```

## 🔐 Seguridad

- Validación de entrada en todos los endpoints
- Prepared statements para prevenir SQL injection
- Encriptación de contraseñas con bcrypt
- Validación de tipos de archivo
- Manejo centralizado de errores

## 🚀 Despliegue

**Railway / Render:**
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Despliega automáticamente

El servidor escucha en `0.0.0.0` para aceptar conexiones desde cualquier IP.