import express from 'express';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Ruta para subir una sola imagen
router.post('/upload-imagen', uploadSingle, (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No se recibió ninguna imagen' 
            });
        }

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
        console.error('Error al subir imagen:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error al subir la imagen',
            error: error.message 
        });
    }
});

export default router;