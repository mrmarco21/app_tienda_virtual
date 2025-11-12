-- Active: 1762938325355@@127.0.0.1@3306@tienda_virtual
-- Base de datos: tienda_virtual
-- Script de creación de tablas para Tienda Virtual Móvil

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS tienda_virtual;
USE tienda_virtual;

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  descripcion TEXT,
  imagen VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_categoria (categoria),
  INDEX idx_nombre (nombre),
  INDEX idx_precio (precio)
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  direccion TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('Tarjeta','Efectivo','Yape','Plin') NOT NULL,
  estado ENUM('Pendiente','Completado','Cancelado') DEFAULT 'Pendiente',
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha)
);

-- Tabla de Detalle de Pedido
CREATE TABLE IF NOT EXISTS detalle_pedido (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NOT NULL,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_pedido_id (pedido_id),
  INDEX idx_producto_id (producto_id),
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente','vendedor') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
);

-- Datos de ejemplo para productos
INSERT INTO productos (nombre, categoria, precio, stock, descripcion, imagen) VALUES
('Smartphone Samsung Galaxy S21', 'Electrónica', 899.99, 25, 'Teléfono inteligente de última generación con cámara de 64MP', 'https://via.placeholder.com/800x800/4CAF50/white?text=Galaxy+S21'),
('Laptop HP Pavilion', 'Electrónica', 699.99, 15, 'Laptop de alto rendimiento con procesador Intel i5', 'https://via.placeholder.com/800x800/2196F3/white?text=Laptop+HP'),
('Auriculares Bluetooth Sony', 'Electrónica', 149.99, 50, 'Auriculares inalámbricos con cancelación de ruido', 'https://via.placeholder.com/800x800/FF9800/white?text=Auriculares'),
('Camiseta Nike Deportiva', 'Ropa', 29.99, 100, 'Camiseta transpirable para deporte', 'https://via.placeholder.com/800x800/9C27B0/white?text=Camiseta+Nike'),
('Zapatillas Adidas Running', 'Calzado', 89.99, 75, 'Zapatillas especiales para correr con tecnología Boost', 'https://via.placeholder.com/800x800/F44336/white?text=Zapatillas'),
('Smartwatch Apple Watch', 'Electrónica', 399.99, 30, 'Reloj inteligente con monitoreo de salud', 'https://via.placeholder.com/800x800/607D8B/white?text=Apple+Watch'),
('Tablet iPad Air', 'Electrónica', 599.99, 20, 'Tablet de alta gama con pantalla Retina', 'https://via.placeholder.com/800x800/795548/white?text=iPad+Air'),
('Mochila Anti-robo', 'Accesorios', 49.99, 40, 'Mochila con cierre de seguridad y puerto USB', 'https://via.placeholder.com/800x800/009688/white?text=Mochila'),
('Teclado Mecánico Gaming', 'Electrónica', 79.99, 60, 'Teclado mecánico RGB para gamers', 'https://via.placeholder.com/800x800/3F51B5/white?text=Teclado'),
('Mouse Inalámbrico Logitech', 'Electrónica', 34.99, 80, 'Mouse ergonómico inalámbrico de alta precisión', 'https://via.placeholder.com/800x800/FFC107/black?text=Mouse');

-- Datos de ejemplo para usuarios (contraseña: 'password123' encriptada)
INSERT INTO usuarios (nombre, email, password, rol) VALUES
('Admin Principal', 'admin@tienda.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'vendedor'),
('Juan Pérez', 'juan.perez@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente'),
('María García', 'maria.garcia@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente');

-- Datos de ejemplo para pedidos
INSERT INTO pedidos (nombre_cliente, email, direccion, total, metodo_pago, estado) VALUES
('Carlos Rodríguez', 'carlos.rodriguez@email.com', 'Jr. Amazonas 123, Lima', 199.98, 'Yape', 'Completado'),
('Ana Martínez', 'ana.martinez@email.com', 'Av. Universitaria 456, Trujillo', 89.99, 'Tarjeta', 'Pendiente'),
('Luis Mendoza', 'luis.mendoza@email.com', 'Jr. Amazonas 453, Yarinacocha', 259.80, 'Yape', 'Pendiente');

-- Datos de ejemplo para detalle de pedidos
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal) VALUES
(1, 3, 2, 99.99), -- Auriculares Sony x2
(1, 8, 1, 49.99), -- Mochila Anti-robo x1
(2, 5, 1, 89.99), -- Zapatillas Adidas x1
(3, 1, 2, 199.8), -- Smartphone Samsung x2
(3, 4, 1, 60.0); -- Camiseta Nike x1

-- Verificar datos insertados
SELECT '=== PRODUCTOS ===' as tabla;
SELECT COUNT(*) as total_productos FROM productos;
SELECT * FROM productos LIMIT 3;

SELECT '=== USUARIOS ===' as tabla;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT id, nombre, email, rol, created_at FROM usuarios;

SELECT '=== PEDIDOS ===' as tabla;
SELECT COUNT(*) as total_pedidos FROM pedidos;
SELECT p.id, p.nombre_cliente, p.email, p.total, p.metodo_pago, p.estado, COUNT(dp.id) as cantidad_productos
FROM pedidos p
LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
GROUP BY p.id;

SELECT '=== DETALLES DE PEDIDOS ===' as tabla;
SELECT COUNT(*) as total_detalles FROM detalle_pedido;
SELECT dp.id, dp.pedido_id, dp.producto_id, dp.cantidad, dp.subtotal, p.nombre as producto_nombre
FROM detalle_pedido dp
JOIN productos p ON dp.producto_id = p.id
LIMIT 5;