import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearNoticia, actualizarNoticia, leerNoticias, autorizarNoticia, leerNoticia, eliminarNoticia,leerImagenesNoticia, buscarNoticias, activarNoticia, desactivarNoticia } from '../controllers/noticias.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });
// router.get('/noticias',leerNoticias);
router.get('/noticias',buscarNoticias);
router.post('/noticias',  passport.authenticate("jwt", { session: false }), upload.single('imgFile'), crearNoticia);
router.put('/noticias/:id', passport.authenticate("jwt", { session: false }), upload.single('imgFile'), actualizarNoticia);
router.delete('/noticias/:id', passport.authenticate("jwt", { session: false }), eliminarNoticia);
router.get('/noticias/:id', leerNoticia);
router.get('/noticias/:id/imagenes', leerImagenesNoticia);
router.put('/autorizarnoticias/:id',  passport.authenticate("jwt", { session: false }), autorizarNoticia);
router.put('/activarnoticias/:id', passport.authenticate("jwt", { session: false }), activarNoticia);
router.put('/desactivarnoticias/:id', passport.authenticate("jwt", { session: false }), desactivarNoticia);
export default router