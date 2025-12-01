-- Script para agregar tabla de direcciones de usuarios
USE tienda_virtual;

-- Crear tabla de direcciones
CREATE TABLE IF NOT EXISTS direcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  alias VARCHAR(100) NOT NULL COMMENT 'Ej: Casa, Trabajo, Casa de mamá',
  direccion TEXT NOT NULL,
  referencia VARCHAR(255) DEFAULT NULL COMMENT 'Referencia adicional',
  telefono VARCHAR(20) DEFAULT NULL,
  es_principal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_es_principal (es_principal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Agregar columna de teléfono a usuarios si no existe
ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS telefono VARCHAR(20) DEFAULT NULL AFTER email;
