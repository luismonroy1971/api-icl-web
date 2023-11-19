import { Router } from 'express';
import multer from 'multer'; 
import { crearAnexo, leerAnexo, leerAnexos, eliminarAnexo, activarAnexo, desactivarAnexo } from '../controllers/anexos.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });

router.get('/anexos',leerAnexos);
router.post('/anexos', upload.single('pdfFile'), crearAnexo);
router.delete('/anexos/:id',eliminarAnexo);
router.get('/anexos/:id', leerAnexo);
router.put('/activaranexos/:id',activarAnexo);
router.put('/desactivaranexos/:id',desactivarAnexo);
export default router