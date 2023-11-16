import { Router } from 'express';
import multer from 'multer'; 
import { crearComunicacion2, actualizarComunicacion2, leerComunicacion2, autorizarComunicacion2, eliminarComunicacion2, buscarComunicacion2s, activarComunicacion2, desactivarComunicacion2 } from '../controllers/comunicaciones2.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/comunicaciones2/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/comunicaciones2',buscarComunicacion2s);
router.post('/comunicaciones2', upload.single('pdfFile'), crearComunicacion2);
router.put('/comunicaciones2/:id', upload.single('pdfFile'),actualizarComunicacion2);
router.delete('/comunicaciones2/:id',eliminarComunicacion2);
router.get('/comunicaciones2/:id', leerComunicacion2);
router.put('/autorizarcomunicaciones2/:id',autorizarComunicacion2);
router.put('/activarcomunicaciones2/:id',activarComunicacion2);
router.put('/desactivarcomunicaciones2/:id',desactivarComunicacion2);
export default router