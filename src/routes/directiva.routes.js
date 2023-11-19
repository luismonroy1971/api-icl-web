import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearDirectiva, actualizarDirectiva, autorizarDirectiva, eliminarDirectiva, leerDirectiva, obtenerPeriodos, buscarDirectivas, activarDirectiva, desactivarDirectiva } from '../controllers/directivas.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/directivas',leerDirectivas);
router.get('/directivas',buscarDirectivas);
router.post('/directivas', passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), crearDirectiva);
router.put('/directivas/:id', passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), actualizarDirectiva);
router.delete('/directivas/:id', passport.authenticate("jwt", { session: false }), eliminarDirectiva);
router.get('/directivas/:id', leerDirectiva);
router.get('/directivasperiodo', obtenerPeriodos);
router.put('/autorizardirectivas/:id',passport.authenticate("jwt", { session: false }), autorizarDirectiva);
router.put('/activardirectivas/:id',passport.authenticate("jwt", { session: false }), activarDirectiva);
router.put('/desactivardirectivas/:id', passport.authenticate("jwt", { session: false }), desactivarDirectiva);
export default router