import express from 'express';
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProductos,
  obtenerCategorias
} from '../controllers/productoController.js';
import { uploadSingle } from '../middleware/upload.js';
import { verificarAuth, verificarVendedor } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.get('/', obtenerProductos);
router.get('/buscar', buscarProductos);
router.get('/categorias', obtenerCategorias);
router.get('/:id', obtenerProductoPorId);

// Rutas protegidas (requieren autenticación de vendedor)
router.post('/', verificarAuth, verificarVendedor, uploadSingle, crearProducto);
router.put('/:id', verificarAuth, verificarVendedor, uploadSingle, actualizarProducto);
router.delete('/:id', verificarAuth, verificarVendedor, eliminarProducto);

export default router;