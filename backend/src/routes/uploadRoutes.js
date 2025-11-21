import express from 'express';
import { uploadSingle } from '../middleware/upload.js';
import { verificarAuth, verificarVendedor } from '../middleware/auth.js';

const router = express.Router();

// Ruta para subir una sola imagen (protegida - solo vendedores/admins)
router.post('/upload-imagen', verificarAuth, verificarVendedor, (req, res) => {
    console.log('📸 Recibiendo petición de subida de imagen...');
    console.log('Headers:', req.headers);
    
    uploadSingle(req, res, (err) => {
        if (err) {
            console.error('❌ Error en multer:', err);
            return res.status(400).json({ 
                success: false, 
                message: err.message || 'Error al procesar la imagen'
            });
        }

        try {
            if (!req.file) {
                console.log('⚠️  No se recibió archivo');
                return res.status(400).json({ 
                    success: false, 
                    message: 'No se recibió ninguna imagen' 
                });
            }

            console.log('✅ Imagen subida exitosamente:', req.file.path);
            
            // req.file.path contiene la URL de Cloudinary
            res.json({
                success: true,
                url: req.file.path,
                secure_url: req.file.path,
                message: 'Imagen subida correctamente',
                data: {
                    filename: req.file.filename,
                    size: req.file.size,
                    format: req.file.mimetype
                }
            });
        } catch (error) {
            console.error('❌ Error al procesar respuesta:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al subir la imagen',
                error: error.message 
            });
        }
    });
});

export default router;