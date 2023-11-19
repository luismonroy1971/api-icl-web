import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearResolucion,actualizarResolucion,eliminarResolucion,autorizarResolucion, obtenerPeriodos, leerResolucion, buscarResoluciones, activarResolucion, desactivarResolucion } from '../controllers/resoluciones.controller.js'

const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/resoluciones',leerResoluciones);
router.get('/resoluciones',buscarResoluciones);
router.post('/resoluciones', passport.authenticate("jwt", { session: false }),  upload.single('pdfFile'), crearResolucion);
router.put('/resoluciones/:id', passport.authenticate("jwt", { session: false }),  upload.single('pdfFile'), actualizarResolucion);
router.delete('/resoluciones/:id', passport.authenticate("jwt", { session: false }),  eliminarResolucion);
router.get('/resoluciones/:id', leerResolucion);
router.get('/resolucionesperiodo', obtenerPeriodos);
router.put('/autorizarresoluciones/:id', passport.authenticate("jwt", { session: false }),  autorizarResolucion);
router.put('/activarresoluciones/:id', passport.authenticate("jwt", { session: false }),  activarResolucion);
router.put('/desactivarresoluciones/:id', passport.authenticate("jwt", { session: false }),  desactivarResolucion);
export default router