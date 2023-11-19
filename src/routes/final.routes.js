import { Router } from 'express';
import multer from 'multer'; 
import { crearFinal, leerFinal, leerFinales, eliminarFinal, activarFinal, desactivarFinal } from '../controllers/final.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  const upload = multer({ storage: storage });

router.get('/resultadofinal',leerFinales);
router.post('/resultadofinal', upload.single('pdfFile'), crearFinal);
router.delete('/resultadofinal/:id',eliminarFinal);
router.get('/resultadofinal/:id', leerFinal);
router.put('/activarresultadofinal/:id',activarFinal);
router.put('/desactivarresultadofinal/:id',desactivarFinal);
export default router