import { Router } from 'express';
import multer from 'multer'; 
import { crearConvocatoria, buscarConvocatorias, autorizarConvocatoria, actualizarConvocatoria, eliminarConvocatoria, leerConvocatoria, obtenerPeriodos, activarConvocatoria, desactivarConvocatoria } from '../controllers/convocatorias.controller.js'
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/convocatorias/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/convocatorias',leerConvocatorias);
router.post('/convocatorias', upload.single('pdfFile'), crearConvocatoria);
router.get('/convocatorias', buscarConvocatorias);
router.put('/convocatorias/:id',upload.single('pdfFile'), actualizarConvocatoria);
router.delete('/convocatorias/:id',eliminarConvocatoria);
router.get('/convocatorias/:id', leerConvocatoria);
router.get('/convocatoriasperiodo', obtenerPeriodos);
router.put('/autorizarconvocatorias/:id',autorizarConvocatoria);
router.put('/activarconvocatorias/:id', activarConvocatoria);
router.put('/desactivarconvocatorias/:id', desactivarConvocatoria);
export default router