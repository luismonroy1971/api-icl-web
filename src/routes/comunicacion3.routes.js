import { Router } from 'express';
import multer from 'multer'; 
import { crearComunicacion2, actualizarComunicacion2, leerComunicacion2, autorizarComunicacion2, eliminarComunicacion2, buscarComunicacion2s, activarComunicacion2, desactivarComunicacion2 } from '../controllers/comunicaciones3.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/comunicaciones3/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/comunicaciones3',buscarComunicacion2s);
router.post('/comunicaciones3', upload.single('pdfFile'), crearComunicacion2);
router.put('/comunicaciones3/:id', upload.single('pdfFile'),actualizarComunicacion2);
router.delete('/comunicaciones3/:id',eliminarComunicacion2);
router.get('/comunicaciones3/:id', leerComunicacion2);
router.put('/autorizarcomunicaciones3/:id',autorizarComunicacion2);
router.put('/activarcomunicaciones3/:id',activarComunicacion2);
router.put('/desactivarcomunicaciones3/:id',desactivarComunicacion2);
export default router