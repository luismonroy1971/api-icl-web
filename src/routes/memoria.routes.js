import { Router } from 'express';
import multer from 'multer'; 
import { crearMemoria, actualizarMemoria, leerMemoria, autorizarMemoria, leerMemorias, obtenerPeriodos, eliminarMemoria, buscarMemorias, activarMemoria, desactivarMemoria } from '../controllers/memorias.controller.js'
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/memorias/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/memorias',leerServicios);
router.get('/memorias',buscarMemorias);
router.post('/memorias', upload.single('pdfFile'), crearMemoria);
router.put('/memorias/:id', upload.single('pdfFile'), actualizarMemoria);
router.delete('/memorias/:id',eliminarMemoria);
router.get('/memorias/:id', leerMemoria);
router.get('/memoriasperiodo', obtenerPeriodos);
router.put('/autorizarmemorias/:id',autorizarMemoria);
router.put('/activarmemorias/:id',activarMemoria);
router.put('/desactivarmemorias/:id',desactivarMemoria);
export default router