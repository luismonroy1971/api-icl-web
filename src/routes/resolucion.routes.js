import { Router } from 'express';
import multer from 'multer'; 
import { crearResolucion,actualizarResolucion,eliminarResolucion,autorizarResolucion, obtenerPeriodos, leerResolucion, buscarResoluciones, activarResolucion, desactivarResolucion } from '../controllers/resoluciones.controller.js'

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/resoluciones/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/resoluciones',leerResoluciones);
router.get('/resoluciones',buscarResoluciones);
router.post('/resoluciones', upload.single('pdfFile'), crearResolucion);
router.put('/resoluciones/:id', upload.single('pdfFile'), actualizarResolucion);
router.delete('/resoluciones/:id',eliminarResolucion);
router.get('/resoluciones/:id', leerResolucion);
router.get('/resolucionesperiodo', obtenerPeriodos);
router.put('/autorizarresoluciones/:id',autorizarResolucion);
router.put('/activarresoluciones/:id',activarResolucion);
router.put('/desactivarresoluciones/:id',desactivarResolucion);
export default router