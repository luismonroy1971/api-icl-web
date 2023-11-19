import { Router } from 'express';
import multer from 'multer'; 
import { crearCurriculo, leerCurriculo, leerCurriculums , eliminarCurriculo, activarCurriculo, desactivarCurriculo } from '../controllers/curriculums.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });

router.get('/curriculos',leerCurriculums );
router.post('/curriculos', upload.single('pdfFile'), crearCurriculo);
router.delete('/curriculos/:id',eliminarCurriculo);
router.get('/curriculos/:id', leerCurriculo);
router.put('/activarcurriculos/:id',activarCurriculo);
router.put('/desactivarcurriculos/:id',desactivarCurriculo);
export default router