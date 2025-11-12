import pool from '../config/db.js';

export const obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos ORDER BY created_at DESC');
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error.message
    });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error.message
    });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio, stock, descripcion } = req.body;
    
    // Validación básica
    if (!nombre || !categoria || !precio || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, categoria, precio, stock'
      });
    }

    // Procesar imagen si se subió
    let imagenUrl = null;
    if (req.file) {
      imagenUrl = req.file.path; // URL de Cloudinary
    }

    const query = `
      INSERT INTO productos (nombre, categoria, precio, stock, descripcion, imagen) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      nombre,
      categoria,
      parseFloat(precio),
      parseInt(stock),
      descripcion || null,
      imagenUrl
    ]);

    // Obtener el producto recién creado
    const [nuevoProducto] = await pool.query('SELECT * FROM productos WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: nuevoProducto[0]
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear producto',
      error: error.message
    });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, stock, descripcion } = req.body;
    
    // Verificar si el producto existe
    const [productoExistente] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (productoExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Procesar nueva imagen si se subió
    let imagenUrl = productoExistente[0].imagen;
    if (req.file) {
      imagenUrl = req.file.path; // URL de Cloudinary
    }

    const query = `
      UPDATE productos 
      SET nombre = ?, categoria = ?, precio = ?, stock = ?, descripcion = ?, imagen = ?
      WHERE id = ?
    `;
    
    const [result] = await pool.query(query, [
      nombre || productoExistente[0].nombre,
      categoria || productoExistente[0].categoria,
      precio ? parseFloat(precio) : productoExistente[0].precio,
      stock !== undefined ? parseInt(stock) : productoExistente[0].stock,
      descripcion !== undefined ? descripcion : productoExistente[0].descripcion,
      imagenUrl,
      id
    ]);

    // Obtener el producto actualizado
    const [productoActualizado] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: productoActualizado[0]
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error.message
    });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el producto existe
    const [productoExistente] = await pool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (productoExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    // Eliminar el producto
    await pool.query('DELETE FROM productos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error.message
    });
  }
};

export const buscarProductos = async (req, res) => {
  try {
    const { q, categoria } = req.query;
    let query = 'SELECT * FROM productos WHERE 1=1';
    const params = [];

    if (q) {
      query += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    if (categoria) {
      query += ' AND categoria = ?';
      params.push(categoria);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error al buscar productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar productos',
      error: error.message
    });
  }
};

export const obtenerCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT DISTINCT categoria FROM productos ORDER BY categoria');
    const categorias = rows.map(row => row.categoria);
    
    res.json({
      success: true,
      data: categorias
    });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};