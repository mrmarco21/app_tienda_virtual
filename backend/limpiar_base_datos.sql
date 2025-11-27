-- Script para limpiar todas las tablas y resetear los IDs a 0
-- ⚠️ ADVERTENCIA: Este script eliminará TODOS los datos de la base de datos

USE tienda_virtual;

-- Deshabilitar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tabla de detalle_pedido
TRUNCATE TABLE detalle_pedido;

-- Limpiar tabla de pedidos
TRUNCATE TABLE pedidos;

-- Limpiar tabla de productos
TRUNCATE TABLE productos;

-- Limpiar tabla de usuarios
TRUNCATE TABLE usuarios;

-- Habilitar verificación de claves foráneas nuevamente
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar que las tablas estén vacías
SELECT 'Tabla productos' as tabla, COUNT(*) as registros FROM productos
UNION ALL
SELECT 'Tabla pedidos', COUNT(*) FROM pedidos
UNION ALL
SELECT 'Tabla detalle_pedido', COUNT(*) FROM detalle_pedido
UNION ALL
SELECT 'Tabla usuarios', COUNT(*) FROM usuarios;

-- Mensaje de confirmación
SELECT '✅ Base de datos limpiada exitosamente. Todos los IDs han sido reseteados a 0.' as mensaje;
