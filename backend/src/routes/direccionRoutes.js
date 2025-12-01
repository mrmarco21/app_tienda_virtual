import express from 'express';
import {
  obtenerDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  establecerPrincipal
} from '../controllers/direccionController.js';

const router = express.Router();

// Obtener direcciones de un usuario
router.get('/usuario/:usuarioId', obtenerDirecciones);

// Crear nueva dirección
router.post('/', crearDireccion);

// Actualizar dirección
router.put('/:id', actualizarDireccion);

// Eliminar dirección
router.delete('/:id', eliminarDireccion);

// Establecer como principal
router.patch('/:id/principal', establecerPrincipal);

export default router;
