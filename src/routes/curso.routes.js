import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearCurso, leerCurso, leerCursos, autorizarCurso, eliminarCurso, actualizarCurso, buscarCursos, activarCurso, desactivarCurso } from '../controllers/cursos.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/cursos',leerCursos);
router.get('/cursos',buscarCursos);
router.post('/cursos', passport.authenticate("jwt", { session: false }), upload.single('imgFile'), crearCurso);
router.put('/cursos/:id', passport.authenticate("jwt", { session: false }), upload.single('imgFile'), actualizarCurso);
router.delete('/cursos/:id', passport.authenticate("jwt", { session: false }), eliminarCurso);
router.get('/cursos/:id', leerCurso);
router.put('/autorizarcursos/:id',passport.authenticate("jwt", { session: false }), autorizarCurso);
router.put('/activarcursos/:id', passport.authenticate("jwt", { session: false }), activarCurso);
router.put('/desactivarcursos/:id', passport.authenticate("jwt", { session: false }), desactivarCurso);
export default router