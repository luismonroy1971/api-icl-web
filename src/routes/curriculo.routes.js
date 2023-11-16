import { Router } from 'express';
import multer from 'multer'; 
import { crearCurriculo, actualizarCurriculo, leerCurriculo, leerCurriculos, eliminarCurriculo, activarCurriculo, desactivarCurriculo } from '../controllers/curriculums.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/curriculos/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/curriculos',leerCurriculos);
router.post('/curriculos', upload.single('pdfFile'), crearCurriculo);
router.put('/curriculos/:id', upload.single('pdfFile'),actualizarCurriculo);
router.delete('/curriculos/:id',eliminarCurriculo);
router.get('/curriculos/:id', leerCurriculo);
router.put('/activarcurriculos/:id',activarCurriculo);
router.put('/desactivarcurriculos/:id',desactivarCurriculo);
export default router