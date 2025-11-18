import express from 'express';
import {
  obtenerPedidos,
  obtenerPedidoPorId,
  crearPedido,
  actualizarEstadoPedido,
  obtenerEstadisticas,
  obtenerPedidosPorEmail
} from '../controllers/pedidoController.js';
import { verificarAuth, verificarVendedor } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas
router.post('/', crearPedido);
router.get('/email/:email', obtenerPedidosPorEmail); // Nueva ruta para obtener pedidos por email

// Rutas protegidas (requieren autenticación de vendedor)
router.get('/', verificarAuth, verificarVendedor, obtenerPedidos);
router.get('/estadisticas', verificarAuth, verificarVendedor, obtenerEstadisticas);
router.get('/:id', verificarAuth, verificarVendedor, obtenerPedidoPorId);
router.put('/:id/estado', verificarAuth, verificarVendedor, actualizarEstadoPedido);

export default router;