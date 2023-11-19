import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { autorizarConvenio, crearConvenio,actualizarConvenio,eliminarConvenio,obtenerPeriodos, leerConvenio, buscarConvenios, activarConvenio, desactivarConvenio } from '../controllers/convenios.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });

// router.get('/convenios',leerConvenios);
router.get('/convenios',buscarConvenios);
router.post('/convenios', passport.authenticate("jwt", { session: false }), upload.single('pdfFile'),  crearConvenio);
router.put('/convenios/:id', passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), actualizarConvenio);
router.delete('/convenios/:id', passport.authenticate("jwt", { session: false }), eliminarConvenio);
router.get('/convenios/:id', leerConvenio);
router.get('/conveniosperiodo', obtenerPeriodos);
router.put('/autorizarconvenios/:id', passport.authenticate("jwt", { session: false }), autorizarConvenio);
router.put('/activarconvenios/:id', passport.authenticate("jwt", { session: false }), activarConvenio);
router.put('/desactivarconvenios/:id', passport.authenticate("jwt", { session: false }), desactivarConvenio);
export default router