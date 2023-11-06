import { Router } from 'express';
import multer from 'multer'; 
import { crearDirectiva, actualizarDirectiva, autorizarDirectiva, eliminarDirectiva, leerDirectiva, obtenerPeriodos, buscarDirectivas, activarDirectiva, desactivarDirectiva } from '../controllers/directivas.controller.js'
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/directivas/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/directivas',leerDirectivas);
router.get('/directivas',buscarDirectivas);
router.post('/directivas', upload.single('pdfFile'), crearDirectiva);
router.put('/directivas/:id',upload.single('pdfFile'), actualizarDirectiva);
router.delete('/directivas/:id',eliminarDirectiva);
router.get('/directivas/:id', leerDirectiva);
router.get('/directivasperiodo', obtenerPeriodos);
router.put('/autorizardirectivas/:id',autorizarDirectiva);
router.put('/activardirectivas/:id',activarDirectiva);
router.put('/desactivardirectivas/:id',desactivarDirectiva);
export default router