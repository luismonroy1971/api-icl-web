import { Router } from 'express';
import multer from 'multer'; 
import { crearNoticia, actualizarNoticia, leerNoticias, autorizarNoticia, leerNoticia, eliminarNoticia,leerImagenesNoticia, buscarNoticias, activarNoticia, desactivarNoticia } from '../controllers/noticias.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/funcionarios/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });
// router.get('/noticias',leerNoticias);
router.get('/noticias',buscarNoticias);
router.post('/noticias', upload.single('imgFile'), crearNoticia);
router.put('/noticias/:id',upload.single('imgFile'), actualizarNoticia);
router.delete('/noticias/:id',eliminarNoticia);
router.get('/noticias/:id', leerNoticia);
router.get('/noticias/:id/imagenes', leerImagenesNoticia);
router.put('/autorizarnoticias/:id', autorizarNoticia);
router.put('/activarnoticias/:id',activarNoticia);
router.put('/desactivarnoticias/:id',desactivarNoticia);
export default router