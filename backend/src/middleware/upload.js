import multer from 'multer';
import storage from '../config/cloudinary.js';

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG y WebP.'), false);
    }
  }
});

export const uploadSingle = upload.single('imagen');
export const uploadMultiple = upload.array('imagenes', 5);

export default upload;