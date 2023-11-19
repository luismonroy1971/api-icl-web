import { Router } from 'express';
import multer from 'multer'; 
import { crearExamen, leerExamen, leerExamenes, eliminarExamen, activarExamen, desactivarExamen } from '../controllers/examenes.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });

router.get('/examenes',leerExamenes);
router.post('/examenes', upload.single('pdfFile'), crearExamen);
router.delete('/examenes/:id',eliminarExamen);
router.get('/examenes/:id', leerExamen);
router.put('/activarexamenes/:id',activarExamen);
router.put('/desactivarexamenes/:id',desactivarExamen);
export default router