import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_2024';

// Middleware para verificar token
export const verificarAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware para verificar rol de vendedor/admin
export const verificarVendedor = (req, res, next) => {
  const rolLower = req.usuario.rol?.toLowerCase() || '';
  
  if (rolLower !== 'vendedor' && rolLower !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador o vendedor' });
  }
  next();
};
