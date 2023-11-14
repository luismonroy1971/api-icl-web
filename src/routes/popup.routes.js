import { Router } from 'express';
import multer from 'multer'; 
import { crearPopup, actualizarPopup, leerPopup, autorizarPopup, eliminarPopup, buscarPopups, activarPopup, desactivarPopup } from '../controllers/popups.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/popups/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });

router.get('/popups',buscarPopups);
router.post('/popups', upload.single('imgFile'), crearPopup);
router.put('/popups/:id', upload.single('imgFile'),actualizarPopup);
router.delete('/popups/:id',eliminarPopup);
router.get('/popups/:id', leerPopup);
router.put('/autorizarpopups/:id',autorizarPopup);
router.put('/activarpopups/:id',activarPopup);
router.put('/desactivarpopups/:id',desactivarPopup);
export default router