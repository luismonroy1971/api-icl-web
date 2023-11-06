import { Router } from 'express';
import multer from 'multer'; 
import { crearNorma, leerNorma, leerNormas, eliminarNorma, autorizarNorma, actualizarNorma, buscarNormas, activarNorma, desactivarNorma } from '../controllers/normainstitucional.controller.js'
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/normas/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/normas',leerNormas);
router.get('/normas',buscarNormas);
router.post('/normas', upload.single('pdfFile'), crearNorma);
router.put('/normas/:id', upload.single('pdfFile'), actualizarNorma);
router.delete('/normas/:id',eliminarNorma);
router.get('/normas/:id', leerNorma);
router.put('/autorizarnormas/:id',autorizarNorma);
router.put('/activarnormas/:id',activarNorma);
router.put('/desactivarnormas/:id',desactivarNorma);
export default router