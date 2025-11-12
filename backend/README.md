# Tienda Virtual Móvil - Backend

Backend completo para Tienda Virtual Móvil desarrollado con Node.js, Express, MySQL y Cloudinary.

## 🚀 Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **Express.js** - Framework web para Node.js
- **MySQL** - Base de datos relacional
- **Cloudinary** - Almacenamiento de imágenes en la nube
- **Multer** - Middleware para manejo de archivos
- **CORS** - Manejo de CORS
- **Dotenv** - Variables de entorno

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/          # Configuraciones (MySQL, Cloudinary)
│   ├── controllers/     # Controladores de lógica de negocio
│   ├── middleware/      # Middleware (Multer para imágenes)
│   ├── routes/          # Rutas de la API
│   ├── app.js           # Configuración de Express
│   └── index.js         # Punto de entrada del servidor
├── .env                 # Variables de entorno
├── database.sql         # Script de base de datos
└── package.json         # Dependencias del proyecto
```

## 🔧 Instalación y Configuración

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
Edita el archivo `.env` con tus configuraciones:

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

### 3. Configurar base de datos
Ejecuta el script SQL para crear la base de datos y tablas:
```bash
mysql -u root -p < database.sql
```

### 4. Iniciar el servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 📡 Endpoints de la API

### Productos
- `GET /api/productos` - Listar todos los productos
- `GET /api/productos/buscar?q=term&categoria=cat` - Buscar productos
- `GET /api/productos/categorias` - Obtener categorías
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto (con imagen)
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Pedidos
- `POST /api/pedidos` - Crear pedido con detalles
- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `PUT /api/pedidos/:id/estado` - Actualizar estado del pedido
- `GET /api/pedidos/usuario/:email` - Obtener pedidos por email

### Usuarios
- `POST /api/usuarios/registro` - Registrar nuevo usuario
- `POST /api/usuarios/login` - Iniciar sesión
- `GET /api/usuarios/perfil/:email` - Obtener perfil de usuario
- `PUT /api/usuarios/perfil/:id` - Actualizar perfil
- `PUT /api/usuarios/cambiar-password/:id` - Cambiar contraseña

## 📋 Ejemplos de Uso

### Crear un producto con imagen
```bash
curl -X POST http://localhost:3000/api/productos \
  -F "nombre=Smartphone Samsung" \
  -F "categoria=Electrónica" \
  -F "precio=899.99" \
  -F "stock=25" \
  -F "descripcion=Teléfono inteligente de última generación" \
  -F "imagen=@/ruta/a/la/imagen.jpg"
```

### Crear un pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_cliente": "Luis Mendoza",
    "email": "luis@gmail.com",
    "direccion": "Jr. Amazonas 453 - Yarinacocha",
    "total": 259.80,
    "metodo_pago": "Yape",
    "productos": [
      {
        "producto_id": 1,
        "cantidad": 2,
        "subtotal": 199.8
      },
      {
        "producto_id": 5,
        "cantidad": 1,
        "subtotal": 60.0
      }
    ]
  }'
```

### Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/usuarios/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan.perez@email.com",
    "password": "password123",
    "rol": "cliente"
  }'
```

## 🔐 Seguridad

- Validación de entrada en todos los endpoints
- Sanitización de consultas SQL con prepared statements
- Encriptación de contraseñas con bcrypt
- Validación de tipos de archivo para imágenes
- Manejo de errores centralizado

## 🚀 Despliegue

### Railway
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Railway detectará automáticamente que es un proyecto Node.js
4. El servidor se desplegará automáticamente

### Render
1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno
3. Establece el comando de inicio: `npm start`
4. Despliega

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, puedes:

1. Revisar los logs del servidor
2. Verificar las variables de entorno
3. Asegurarte de que MySQL esté ejecutándose
4. Verificar la conexión a Cloudinary

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.