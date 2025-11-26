-- Active: 1753400898419@@127.0.0.1@3306@tienda_virtual
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

-- Tabla de Detalle de Pedido actualizado
-- ⚠️ CUIDADO: Esto eliminará todos los pedidos existentes
DROP TABLE IF EXISTS pedidos;

-- Luego crea la tabla con la estructura actualizada
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion TEXT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago ENUM('Tarjeta','Efectivo','Yape','Plin','Billetera Digital') NOT NULL,
  estado ENUM('Pendiente','Completado','Cancelado') DEFAULT 'Pendiente',
  usuario_id INT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_estado (estado),
  INDEX idx_fecha (fecha),
  INDEX idx_usuario_id (usuario_id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
