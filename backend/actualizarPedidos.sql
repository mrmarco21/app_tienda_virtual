-- Active: 1753400898419@@127.0.0.1@3306@tienda_virtual
-- 1. Agregar campo telefono
ALTER TABLE pedidos 
ADD COLUMN telefono VARCHAR(20) AFTER email;

-- 2. Agregar campo usuario_id
ALTER TABLE pedidos 
ADD COLUMN usuario_id INT NULL AFTER estado;

-- 3. Agregar índice para usuario_id
ALTER TABLE pedidos 
ADD INDEX idx_usuario_id (usuario_id);

-- 4. Si tienes tabla usuarios, agregar foreign key
ALTER TABLE pedidos 
ADD FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL;

-- 5. Actualizar el ENUM de metodo_pago (opcional, para incluir más opciones)
ALTER TABLE pedidos 
MODIFY COLUMN metodo_pago ENUM('Tarjeta','Efectivo','Yape','Plin','Billetera Digital') NOT NULL;

-- Ver la estructura de la tabla
DESCRIBE pedidos;

-- Debería mostrar algo así:
-- nombre_cliente | varchar(255)
-- email          | varchar(255)
-- telefono       | varchar(20)      ← NUEVO
-- direccion      | text
-- total          | decimal(10,2)
-- metodo_pago    | enum(...)
-- estado         | enum(...)
-- usuario_id     | int              ← NUEVO
-- fecha          | timestamp
-- updated_at     | timestamp