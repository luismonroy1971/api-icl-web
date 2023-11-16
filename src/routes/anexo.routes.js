import { Router } from 'express';
import multer from 'multer'; 
import { crearAnexo, actualizarAnexo, leerAnexo, leerAnexos, eliminarAnexo, activarAnexo, desactivarAnexo } from '../controllers/anexos.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/anexos/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/anexos',leerAnexos);
router.post('/anexos', upload.single('pdfFile'), crearAnexo);
router.put('/anexos/:id', upload.single('pdfFile'),actualizarAnexo);
router.delete('/anexos/:id',eliminarAnexo);
router.get('/anexos/:id', leerAnexo);
router.put('/activaranexos/:id',activarAnexo);
router.put('/desactivaranexos/:id',desactivarAnexo);
export default router