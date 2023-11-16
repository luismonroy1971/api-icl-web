import { Router } from 'express';
import multer from 'multer'; 
import { crearComunicacion1, actualizarComunicacion1, leerComunicacion1, autorizarComunicacion1, eliminarComunicacion1, buscarComunicacion1s, activarComunicacion1, desactivarComunicacion1 } from '../controllers/comunicaciones1.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/comunicaciones1/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/comunicaciones1',buscarComunicacion1s);
router.post('/comunicaciones1', upload.single('pdfFile'), crearComunicacion1);
router.put('/comunicaciones1/:id', upload.single('pdfFile'),actualizarComunicacion1);
router.delete('/comunicaciones1/:id',eliminarComunicacion1);
router.get('/comunicaciones1/:id', leerComunicacion1);
router.put('/autorizarcomunicaciones1/:id',autorizarComunicacion1);
router.put('/activarcomunicaciones1/:id',activarComunicacion1);
router.put('/desactivarcomunicaciones1/:id',desactivarComunicacion1);
export default router