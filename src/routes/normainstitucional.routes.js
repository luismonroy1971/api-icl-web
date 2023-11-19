import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearNorma, leerNorma, leerNormas, eliminarNorma, autorizarNorma, actualizarNorma, buscarNormas, activarNorma, desactivarNorma } from '../controllers/normainstitucional.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/normas',leerNormas);
router.get('/normas',buscarNormas);
router.post('/normas',  passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), crearNorma);
router.put('/normas/:id',  passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), actualizarNorma);
router.delete('/normas/:id', passport.authenticate("jwt", { session: false }), eliminarNorma);
router.get('/normas/:id', leerNorma);
router.put('/autorizarnormas/:id', passport.authenticate("jwt", { session: false }), autorizarNorma);
router.put('/activarnormas/:id', passport.authenticate("jwt", { session: false }), activarNorma);
router.put('/desactivarnormas/:id', passport.authenticate("jwt", { session: false }), desactivarNorma);
export default router