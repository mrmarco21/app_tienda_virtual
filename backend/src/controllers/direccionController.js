import pool from '../config/db.js';

// =============================
// 📍 OBTENER DIRECCIONES DEL USUARIO
// =============================
export const obtenerDirecciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const [direcciones] = await pool.query(
      'SELECT * FROM direcciones WHERE usuario_id = ? ORDER BY es_principal DESC, created_at DESC',
      [usuarioId]
    );

    // Convertir valores booleanos correctamente
    const direccionesFormateadas = direcciones.map(dir => ({
      ...dir,
      es_principal: Boolean(dir.es_principal)
    }));

    res.json({
      success: true,
      data: direccionesFormateadas
    });
  } catch (error) {
    console.error('Error al obtener direcciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener direcciones',
      error: error.message
    });
  }
};

// =============================
// ➕ CREAR DIRECCIÓN
// =============================
export const crearDireccion = async (req, res) => {
  try {
    const { usuarioId, alias, direccion, referencia, telefono, es_principal } = req.body;

    if (!usuarioId || !alias || !direccion) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: usuarioId, alias, direccion'
      });
    }

    // Si es principal, quitar el flag de las demás
    if (es_principal) {
      await pool.query(
        'UPDATE direcciones SET es_principal = FALSE WHERE usuario_id = ?',
        [usuarioId]
      );
    }

    const [result] = await pool.query(
      'INSERT INTO direcciones (usuario_id, alias, direccion, referencia, telefono, es_principal) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, alias, direccion, referencia || null, telefono || null, es_principal || false]
    );

    const [nuevaDireccion] = await pool.query(
      'SELECT * FROM direcciones WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Dirección creada exitosamente',
      data: nuevaDireccion[0]
    });
  } catch (error) {
    console.error('Error al crear dirección:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear dirección',
      error: error.message
    });
  }
};

// =============================
// ✏️ ACTUALIZAR DIRECCIÓN
// =============================
export const actualizarDireccion = async (req, res) => {
  try {
    const { id } = req.params;
    const { alias, direccion, referencia, telefono, es_principal } = req.body;

    const [direccionExistente] = await pool.query(
      'SELECT * FROM direcciones WHERE id = ?',
      [id]
    );

    if (direccionExistente.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dirección no encontrada'
      });
    }

    // Si se marca como principal, quitar el flag de las demás
    if (es_principal) {
      await pool.query(
        'UPDATE direcciones SET es_principal = FALSE WHERE usuario_id = ?',
        [direccionExistente[0].usuario_id]
      );
    }

    await pool.query(
      'UPDATE direcciones SET alias = ?, direccion = ?, referencia = ?, telefono = ?, es_principal = ? WHERE id = ?',
      [
        alias || direccionExistente[0].alias,
        direccion || direccionExistente[0].direccion,
        referencia !== undefined ? referencia : direccionExistente[0].referencia,
        telefono !== undefined ? telefono : direccionExistente[0].telefono,
        es_principal !== undefined ? es_principal : direccionExistente[0].es_principal,
        id
      ]
    );

    const [direccionActualizada] = await pool.query(
      'SELECT * FROM direcciones WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Dirección actualizada exitosamente',
      data: direccionActualizada[0]
    });
  } catch (error) {
    console.error('Error al actualizar dirección:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar dirección',
      error: error.message
    });
  }
};

// =============================
// 🗑️ ELIMINAR DIRECCIÓN
// =============================
export const eliminarDireccion = async (req, res) => {
  try {
    const { id } = req.params;

    const [direccion] = await pool.query(
      'SELECT * FROM direcciones WHERE id = ?',
      [id]
    );

    if (direccion.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dirección no encontrada'
      });
    }

    await pool.query('DELETE FROM direcciones WHERE id = ?', [id]);

    // Si era la principal, marcar otra como principal
    if (direccion[0].es_principal) {
      await pool.query(
        'UPDATE direcciones SET es_principal = TRUE WHERE usuario_id = ? ORDER BY created_at DESC LIMIT 1',
        [direccion[0].usuario_id]
      );
    }

    res.json({
      success: true,
      message: 'Dirección eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar dirección:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar dirección',
      error: error.message
    });
  }
};

// =============================
// ⭐ ESTABLECER DIRECCIÓN PRINCIPAL
// =============================
export const establecerPrincipal = async (req, res) => {
  try {
    const { id } = req.params;

    const [direccion] = await pool.query(
      'SELECT * FROM direcciones WHERE id = ?',
      [id]
    );

    if (direccion.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Dirección no encontrada'
      });
    }

    // Quitar el flag de todas las direcciones del usuario
    await pool.query(
      'UPDATE direcciones SET es_principal = FALSE WHERE usuario_id = ?',
      [direccion[0].usuario_id]
    );

    // Marcar esta como principal
    await pool.query(
      'UPDATE direcciones SET es_principal = TRUE WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Dirección principal actualizada'
    });
  } catch (error) {
    console.error('Error al establecer dirección principal:', error);
    res.status(500).json({
      success: false,
      message: 'Error al establecer dirección principal',
      error: error.message
    });
  }
};
