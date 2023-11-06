import { Router } from 'express';
import multer from 'multer'; 
import { crearRendicion, leerRendicion, obtenerPeriodos, autorizarRendicion, eliminarRendicion, actualizarRendicion, buscarRendiciones, activarRendicion, desactivarRendicion } from '../controllers/rendicioncuenta.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/rendiciones/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

// router.get('/rendiciones',leerRendiciones);
router.get('/rendiciones',buscarRendiciones);
router.post('/rendiciones', upload.single('pdfFile'), crearRendicion);
router.put('/rendiciones/:id',upload.single('pdfFile'), actualizarRendicion);
router.delete('/rendiciones/:id',eliminarRendicion);
router.get('/rendiciones/:id', leerRendicion);
router.get('/rendicionesperiodo', obtenerPeriodos);
router.put('/autorizarrendiciones/:id',autorizarRendicion);
router.put('/activarrendiciones/:id',activarRendicion);
router.put('/desactivarrendiciones/:id',desactivarRendicion);
export default router