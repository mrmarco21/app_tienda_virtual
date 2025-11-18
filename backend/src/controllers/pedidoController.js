import pool from '../config/db.js';

// Obtener todos los pedidos (Admin)
export const obtenerPedidos = async (req, res) => {
  try {
    const { estado, limite = 50, pagina = 1 } = req.query;
    const offset = (pagina - 1) * limite;

    let query = `
      SELECT p.*, 
        COUNT(dp.id) as cantidad_productos,
        GROUP_CONCAT(CONCAT(pr.nombre, ' (x', dp.cantidad, ')') SEPARATOR ', ') as productos
      FROM pedidos p
      LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
    `;

    const params = [];
    if (estado) {
      query += ' WHERE p.estado = ?';
      params.push(estado);
    }

    query += ' GROUP BY p.id ORDER BY p.fecha DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limite), parseInt(offset));

    const [pedidos] = await pool.query(query, params);

    // Contar total
    let countQuery = 'SELECT COUNT(*) as total FROM pedidos';
    if (estado) {
      countQuery += ' WHERE estado = ?';
    }
    const [countResult] = await pool.query(countQuery, estado ? [estado] : []);

    res.json({
      pedidos,
      total: countResult[0].total,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(countResult[0].total / limite)
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};

// Obtener detalle de un pedido
export const obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [pedidos] = await pool.query('SELECT * FROM pedidos WHERE id = ?', [id]);

    if (pedidos.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const [detalles] = await pool.query(
      `SELECT dp.*, p.nombre, p.imagen, p.precio
       FROM detalle_pedido dp
       JOIN productos p ON dp.producto_id = p.id
       WHERE dp.pedido_id = ?`,
      [id]
    );

    res.json({
      ...pedidos[0],
      productos: detalles
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
};

// Crear pedido
export const crearPedido = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { nombre_cliente, email, telefono, direccion, metodo_pago, productos, usuario_id } = req.body;

    // Validar datos requeridos
    if (!nombre_cliente || !email || !telefono || !direccion || !metodo_pago || !productos || productos.length === 0) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Calcular total
    let total = 0;
    for (const item of productos) {
      const [producto] = await connection.query(
        'SELECT precio, stock FROM productos WHERE id = ?',
        [item.producto_id]
      );

      if (producto.length === 0) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }

      if (producto[0].stock < item.cantidad) {
        throw new Error(`Stock insuficiente para producto ${item.producto_id}`);
      }

      total += producto[0].precio * item.cantidad;
    }

    // Crear pedido con usuario_id y telefono
    const [resultado] = await connection.query(
      'INSERT INTO pedidos (nombre_cliente, email, telefono, direccion, total, metodo_pago, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombre_cliente, email, telefono, direccion, total, metodo_pago, usuario_id || null]
    );

    const pedidoId = resultado.insertId;

    // Insertar detalles y actualizar stock
    for (const item of productos) {
      const [producto] = await connection.query(
        'SELECT precio FROM productos WHERE id = ?',
        [item.producto_id]
      );

      const subtotal = producto[0].precio * item.cantidad;

      await connection.query(
        'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, subtotal) VALUES (?, ?, ?, ?)',
        [pedidoId, item.producto_id, item.cantidad, subtotal]
      );

      await connection.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.producto_id]
      );
    }

    await connection.commit();

    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedidoId,
      total
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear pedido:', error);
    res.status(500).json({ error: error.message || 'Error al crear pedido' });
  } finally {
    connection.release();
  }
};

// Actualizar estado de pedido
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['Pendiente', 'Completado', 'Cancelado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const [resultado] = await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    res.json({ mensaje: 'Estado actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
};

// Estadísticas para dashboard
export const obtenerEstadisticas = async (req, res) => {
  try {
    const [ventasHoy] = await pool.query(
      'SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto FROM pedidos WHERE DATE(fecha) = CURDATE()'
    );

    const [ventasMes] = await pool.query(
      'SELECT COUNT(*) as total, COALESCE(SUM(total), 0) as monto FROM pedidos WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())'
    );

    const [pedidosPendientes] = await pool.query(
      'SELECT COUNT(*) as total FROM pedidos WHERE estado = "Pendiente"'
    );

    const [productosAgotados] = await pool.query(
      'SELECT COUNT(*) as total FROM productos WHERE stock < 5'
    );

    const [topProductos] = await pool.query(
      `SELECT p.nombre, p.imagen, SUM(dp.cantidad) as vendidos, SUM(dp.subtotal) as ingresos
       FROM detalle_pedido dp
       JOIN productos p ON dp.producto_id = p.id
       GROUP BY dp.producto_id
       ORDER BY vendidos DESC
       LIMIT 5`
    );

    res.json({
      ventasHoy: ventasHoy[0],
      ventasMes: ventasMes[0],
      pedidosPendientes: pedidosPendientes[0].total,
      productosAgotados: productosAgotados[0].total,
      topProductos
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
};

// Obtener pedidos de un usuario por email
export const obtenerPedidosPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const [pedidos] = await pool.query(
      `SELECT p.*, 
        COUNT(dp.id) as cantidad_productos,
        GROUP_CONCAT(CONCAT(pr.nombre, ' (x', dp.cantidad, ')') SEPARATOR ', ') as productos
       FROM pedidos p
       LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
       LEFT JOIN productos pr ON dp.producto_id = pr.id
       WHERE p.email = ?
       GROUP BY p.id
       ORDER BY p.fecha DESC`,
      [email]
    );

    res.json({ pedidos });
  } catch (error) {
    console.error('Error al obtener pedidos por email:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
};