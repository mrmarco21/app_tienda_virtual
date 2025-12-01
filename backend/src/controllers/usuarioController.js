import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // 👈 agregado para generar tokens

// =============================
// 📌 REGISTRAR USUARIO
// =============================
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const [result] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol]
    );

    // Obtener usuario recién creado
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

// =============================
// 🔐 LOGIN USUARIO (CON TOKEN)
// =============================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: email, password'
      });
    }

    // Buscar usuario
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
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Respuesta sin contraseña
    res.json({
      success: true,
      message: 'Login exitoso',
      token, // 👈 aquí te devuelve el token
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
        created_at: usuario.created_at
      }
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

// =============================
// 👤 OBTENER PERFIL
// =============================
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

// =============================
// ✏️ ACTUALIZAR PERFIL
// =============================
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

    const [usuarioExistente] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (usuarioExistente.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (email && email !== usuarioExistente[0].email) {
      const [emailExistente] = await pool.query('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, id]);
      if (emailExistente.length > 0) {
        return res.status(409).json({ success: false, message: 'El email ya está en uso' });
      }
    }

    const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
    await pool.query(query, [nombre || usuarioExistente[0].nombre, email || usuarioExistente[0].email, id]);

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

// =============================
// 🔑 CAMBIAR CONTRASEÑA
// =============================
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

    const [usuarios] = await pool.query('SELECT password FROM usuarios WHERE id = ?', [id]);
    if (usuarios.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const passwordValida = await bcrypt.compare(passwordActual, usuarios[0].password);
    if (!passwordValida) {
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(passwordNuevo, 10);
    await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);

    res.json({ success: true, message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña',
      error: error.message
    });
  }
};

// =============================
// 👥 OBTENER USUARIOS
// =============================
export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC'
    );

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

// =============================
// 🧾 OBTENER PEDIDOS POR EMAIL
// =============================
export const obtenerPedidosPorEmail = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email requerido' });
    }

    // Obtener pedidos
    const [pedidos] = await pool.query(
      `SELECT * FROM pedidos WHERE email = ? ORDER BY fecha DESC`,
      [email]
    );

    // Para cada pedido, obtener sus productos
    for (let pedido of pedidos) {
      const [productos] = await pool.query(
        `SELECT 
          pr.id,
          pr.nombre,
          pr.precio,
          pr.imagen,
          pr.categoria,
          dp.cantidad,
          dp.subtotal
         FROM detalle_pedido dp
         INNER JOIN productos pr ON dp.producto_id = pr.id
         WHERE dp.pedido_id = ?`,
        [pedido.id]
      );
      pedido.productos = productos;
    }

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
