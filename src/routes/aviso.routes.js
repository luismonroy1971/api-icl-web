import { Router } from 'express';
import multer from 'multer'; 
import { crearAviso, leerAviso, leerAvisos, eliminarAviso, activarAviso, desactivarAviso } from '../controllers/avisos.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });

router.get('/avisos',leerAvisos);
router.post('/avisos', upload.single('pdfFile'), crearAviso);
router.delete('/avisos/:id',eliminarAviso);
router.get('/avisos/:id', leerAviso);
router.put('/activaravisos/:id',activarAviso);
router.put('/desactivaravisos/:id',desactivarAviso);
export default router