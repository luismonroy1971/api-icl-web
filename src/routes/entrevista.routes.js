import { Router } from 'express';
import multer from 'multer'; 
import { crearEntrevista, actualizarEntrevista, leerEntrevista, leerEntrevistas, eliminarEntrevista, activarEntrevista, desactivarEntrevista } from '../controllers/entrevistas.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/entrevistas/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/entrevistas',leerEntrevistas);
router.post('/entrevistas', upload.single('pdfFile'), crearEntrevista);
router.put('/entrevistas/:id', upload.single('pdfFile'),actualizarEntrevista);
router.delete('/entrevistas/:id',eliminarEntrevista);
router.get('/entrevistas/:id', leerEntrevista);
router.put('/activarentrevistas/:id',activarEntrevista);
router.put('/desactivarentrevistas/:id',desactivarEntrevista);
export default router