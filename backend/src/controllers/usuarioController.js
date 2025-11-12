import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol = 'cliente' } = req.body;

    // Validación básica
    if (!nombre || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, email, password'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Verificar si el email ya existe
    const [usuarioExistente] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (usuarioExistente.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Validar rol
    const rolesValidos = ['cliente', 'vendedor'];
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol no válido. Roles permitidos: cliente, vendedor'
      });
    }

    // Encriptar contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar usuario
    const query = `
      INSERT INTO usuarios (nombre, email, password, rol) 
      VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
      nombre,
      email,
      hashedPassword,
      rol
    ]);

    // Obtener el usuario recién creado (sin contraseña)
    const [nuevoUsuario] = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: nuevoUsuario[0]
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: email, password'
      });
    }

    // Buscar usuario por email
    const [usuarios] = await pool.query(
      'SELECT id, nombre, email, password, rol, created_at FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    const usuario = usuarios[0];

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Eliminar contraseña del objeto de respuesta
    const usuarioResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      created_at: usuario.created_at
    };

    res.json({
      success: true,
      message: 'Login exitoso',
      data: usuarioResponse
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido'
      });
    }

    const [usuarios] = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE email = ?',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: usuarios[0]
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
};

export const actualizarPerfil = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email } = req.body;

    if (!nombre && !email) {
      return res.status(400).json({
        success: false,
        message: 'Debe proporcionar al menos un campo para actualizar'
      });
    }

    // Verificar si el usuario existe
    const [usuarioExistente] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (usuarioExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el nuevo email ya está en uso por otro usuario
    if (email && email !== usuarioExistente[0].email) {
      const [emailExistente] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
      if (emailExistente.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'El email ya está en uso por otro usuario'
        });
      }
    }

    // Construir query dinámico
    let query = 'UPDATE usuarios SET ';
    const params = [];
    const updates = [];

    if (nombre) {
      updates.push('nombre = ?');
      params.push(nombre);
    }

    if (email) {
      updates.push('email = ?');
      params.push(email);
    }

    query += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    // Obtener el usuario actualizado
    const [usuarioActualizado] = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: usuarioActualizado[0]
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
};

export const cambiarPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { passwordActual, passwordNuevo } = req.body;

    if (!passwordActual || !passwordNuevo) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren la contraseña actual y la nueva contraseña'
      });
    }

    if (passwordNuevo.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    // Buscar usuario
    const [usuarios] = await pool.query('SELECT password FROM usuarios WHERE id = ?', [id]);
    if (usuarios.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const passwordValida = await bcrypt.compare(passwordActual, usuarios[0].password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(passwordNuevo, saltRounds);

    // Actualizar contraseña
    await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, email, rol, created_at 
      FROM usuarios 
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

export const obtenerPedidosPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requerido'
      });
    }

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

    res.json({
      success: true,
      data: pedidos,
      total: pedidos.length
    });

  } catch (error) {
    console.error('Error al obtener pedidos por email:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener pedidos',
      error: error.message
    });
  }
};