import { Router } from 'express';
import multer from 'multer'; 
import { autorizarConvenio, crearConvenio, actualizarConvenio, eliminarConvenio, obtenerPeriodos, leerConvenio, buscarConvenios, activarConvenio, desactivarConvenio } from '../controllers/convenios.controller.js';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/convenios/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get('/convenios', buscarConvenios);
router.post('/convenios', upload.fields([{ name: 'pdfFile', maxCount: 10 }]), crearConvenio);
router.put('/convenios/:id', upload.fields([{ name: 'pdfFile', maxCount: 10 }]), actualizarConvenio);
router.delete('/convenios/:id', eliminarConvenio);
router.get('/convenios/:id', leerConvenio);
router.get('/conveniosperiodo', obtenerPeriodos);
router.put('/autorizarconvenios/:id', autorizarConvenio);
router.put('/activarconvenios/:id', activarConvenio);
router.put('/desactivarconvenios/:id', desactivarConvenio);

export default router;
