import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearMemoria, actualizarMemoria, leerMemoria, autorizarMemoria, leerMemorias, obtenerPeriodos, eliminarMemoria, buscarMemorias, activarMemoria, desactivarMemoria } from '../controllers/memorias.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/memorias',leerServicios);
router.get('/memorias',buscarMemorias);
router.post('/memorias',  passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), crearMemoria);
router.put('/memorias/:id',  passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), actualizarMemoria);
router.delete('/memorias/:id', passport.authenticate("jwt", { session: false }), eliminarMemoria);
router.get('/memorias/:id', leerMemoria);
router.get('/memoriasperiodo', obtenerPeriodos);
router.put('/autorizarmemorias/:id', passport.authenticate("jwt", { session: false }), autorizarMemoria);
router.put('/activarmemorias/:id', passport.authenticate("jwt", { session: false }), activarMemoria);
router.put('/desactivarmemorias/:id', passport.authenticate("jwt", { session: false }), desactivarMemoria);
export default router