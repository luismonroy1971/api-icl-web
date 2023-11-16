import { Router } from 'express';
import multer from 'multer'; 
import { crearFinal, actualizarFinal, leerFinal, leerFinales, eliminarFinal, activarFinal, desactivarFinal } from '../controllers/final.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/resultadofinal/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/resultadofinal',leerFinales);
router.post('/resultadofinal', upload.single('pdfFile'), crearFinal);
router.put('/resultadofinal/:id', upload.single('pdfFile'),actualizarFinal);
router.delete('/resultadofinal/:id',eliminarFinal);
router.get('/resultadofinal/:id', leerFinal);
router.put('/activarresultadofinal/:id',activarFinal);
router.put('/desactivarresultadofinal/:id',desactivarFinal);
export default router