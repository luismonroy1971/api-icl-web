import { Router } from 'express';
import multer from 'multer'; 
import { crearImagen,actualizarImagen, eliminarImagen, leerImagen, leerImagenes } from '../controllers/noticiaimagen.controller.js'
const router = Router();
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });
router.get('/imagenes',leerImagenes);
router.post('/imagenes', upload.single('imgFile'), crearImagen);
router.put('/imagenes/:id',upload.single('imgFile'), actualizarImagen);
router.delete('/imagenes/:id',eliminarImagen);
router.get('/imagenes/:id', leerImagen);

export default router