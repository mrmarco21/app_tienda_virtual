-- Script para agregar soft delete a la tabla productos
USE tienda_virtual;

-- Agregar columna 'activo' a la tabla productos
ALTER TABLE productos 
ADD COLUMN activo BOOLEAN DEFAULT TRUE AFTER imagen;

-- Actualizar todos los productos existentes como activos
UPDATE productos SET activo = TRUE WHERE activo IS NULL;

-- Verificar cambios
SELECT id, nombre, activo FROM productos LIMIT 5;