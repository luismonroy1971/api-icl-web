import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearFuncionario, leerFuncionario, leerFuncionarios, autorizarFuncionario, eliminarFuncionario, actualizarFuncionario, buscarFuncionarios, activarFuncionario, desactivarFuncionario } from '../controllers/funcionarios.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });
// router.get('/funcionarios',leerFuncionarios);
router.get('/funcionarios',buscarFuncionarios);
router.post('/funcionarios', passport.authenticate("jwt", { session: false }), upload.single('imgFile'), crearFuncionario);
router.put('/funcionarios/:id',passport.authenticate("jwt", { session: false }), upload.single('imgFile'), actualizarFuncionario);
router.delete('/funcionarios/:id', passport.authenticate("jwt", { session: false }), eliminarFuncionario);
router.get('/funcionarios/:id', leerFuncionario);
router.put('/autorizarfuncionarios/:id', passport.authenticate("jwt", { session: false }), autorizarFuncionario);
router.put('/activarfuncionarios/:id', passport.authenticate("jwt", { session: false }), activarFuncionario);
router.put('/desactivarfuncionarios/:id', passport.authenticate("jwt", { session: false }), desactivarFuncionario);
export default router