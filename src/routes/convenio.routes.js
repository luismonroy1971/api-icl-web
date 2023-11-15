import { Router } from 'express';
import multer from 'multer'; 
import { autorizarConvenio, crearConvenio,actualizarConvenio,eliminarConvenio,obtenerPeriodos, leerConvenio, buscarConvenios, activarConvenio, desactivarConvenio } from '../controllers/convenios.controller.js'
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/convenios/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });

// router.get('/convenios',leerConvenios);
router.get('/convenios',buscarConvenios);
router.post('/convenios', upload.single('pdfFile'), crearConvenio);
router.put('/convenios', upload.single('pdfFile'), actualizarConvenio);
router.delete('/convenios/:id',eliminarConvenio);
router.get('/convenios/:id', leerConvenio);
router.get('/conveniosperiodo', obtenerPeriodos);
router.put('/autorizarconvenios/:id',autorizarConvenio);
router.put('/activarconvenios/:id',activarConvenio);
router.put('/desactivarconvenios/:id',desactivarConvenio);
export default router