import express from 'express';
import {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  obtenerUsuarios,
  obtenerPedidosPorEmail
} from '../controllers/usuarioController.js';

const router = express.Router();

// Rutas de autenticación
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);

// Rutas de perfil
router.get('/perfil/:email', obtenerPerfil);
router.put('/perfil/:id', actualizarPerfil);
router.put('/cambiar-password/:id', cambiarPassword);

// Rutas de pedidos por usuario
router.get('/pedidos/:email', obtenerPedidosPorEmail);

// Rutas administrativas
router.get('/', obtenerUsuarios);

export default router;