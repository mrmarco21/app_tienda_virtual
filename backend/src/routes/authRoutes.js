import express from 'express';
import { login, registro, verificarToken } from '../controllers/authController.js';
import { verificarAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/registro', registro);
router.get('/verificar', verificarAuth, verificarToken);

export default router;
