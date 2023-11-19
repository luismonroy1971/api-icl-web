import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearProyecto, leerProyecto, leerProyectos, autorizarProyecto, eliminarProyecto, actualizarProyecto, buscarProyectos, activarProyecto, desactivarProyecto } from '../controllers/proyectos.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });
// router.get('/proyectos',leerProyectos);
router.get('/proyectos',buscarProyectos);
router.post('/proyectos',  passport.authenticate("jwt", { session: false }), upload.single('imgFile'), crearProyecto);
router.put('/proyectos/:id',  passport.authenticate("jwt", { session: false }), upload.single('imgFile'), actualizarProyecto);
router.delete('/proyectos/:id', passport.authenticate("jwt", { session: false }), eliminarProyecto);
router.get('/proyectos/:id', leerProyecto);
router.put('/autorizarproyectos/:id', passport.authenticate("jwt", { session: false }), autorizarProyecto);
router.put('/activarproyectos/:id', passport.authenticate("jwt", { session: false }), activarProyecto);
router.put('/desactivarproyectos/:id', passport.authenticate("jwt", { session: false }), desactivarProyecto);
export default router