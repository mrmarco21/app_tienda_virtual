import app from './app.js';
import { testConnection } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    console.log('🔍 Verificando conexión a MySQL...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a MySQL. Por favor, verifica tu configuración.');
      process.exit(1);
    }

    console.log('✅ Conexión a MySQL establecida correctamente');

    // Iniciar el servidor en todas las interfaces (0.0.0.0)
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor ejecutándose en http://0.0.0.0:${PORT}`);
      console.log(`🌐 Accesible desde la red local en http://192.168.18.31:${PORT}`);
      console.log(`📡 Endpoints disponibles:`);
      console.log(`   • Productos: http://localhost:${PORT}/api/productos`);
      console.log(`   • Pedidos: http://localhost:${PORT}/api/pedidos`);
      console.log(`   • Usuarios: http://localhost:${PORT}/api/usuarios`);
      console.log(`   • Health Check: http://localhost:${PORT}/api/health`);
      console.log('');
      console.log('📖 Documentación de la API:');
      console.log('   • GET /api/productos - Listar todos los productos');
      console.log('   • GET /api/productos/buscar?q=term&categoria=cat - Buscar productos');
      console.log('   • GET /api/productos/categorias - Obtener categorías');
      console.log('   • GET /api/productos/:id - Obtener producto por ID');
      console.log('   • POST /api/productos - Crear producto (con imagen)');
      console.log('   • PUT /api/productos/:id - Actualizar producto');
      console.log('   • DELETE /api/productos/:id - Eliminar producto');
      console.log('');
      console.log('   • POST /api/pedidos - Crear pedido con detalles');
      console.log('   • GET /api/pedidos - Listar todos los pedidos');
      console.log('   • GET /api/pedidos/:id - Obtener pedido por ID');
      console.log('   • PUT /api/pedidos/:id/estado - Actualizar estado del pedido');
      console.log('   • GET /api/pedidos/usuario/:email - Obtener pedidos por email');
      console.log('');
      console.log('   • POST /api/usuarios/registro - Registrar nuevo usuario');
      console.log('   • POST /api/usuarios/login - Iniciar sesión');
      console.log('   • GET /api/usuarios/perfil/:email - Obtener perfil de usuario');
      console.log('   • PUT /api/usuarios/perfil/:id - Actualizar perfil');
      console.log('   • PUT /api/usuarios/cambiar-password/:id - Cambiar contraseña');
      console.log('');
      console.log('🎯 Backend de Tienda Virtual Móvil listo para usar!');
    });

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Rechazo no manejado en:', promise, 'razón:', reason);
  process.exit(1);
});

// Iniciar el servidor
startServer();