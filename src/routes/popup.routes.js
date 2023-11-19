import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearPopup, actualizarPopup, leerPopup, autorizarPopup, eliminarPopup, buscarPopups, activarPopup, desactivarPopup } from '../controllers/popups.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });

router.get('/popups',buscarPopups);
router.post('/popups',  passport.authenticate("jwt", { session: false }), upload.single('imgFile'), crearPopup);
router.put('/popups/:id',  passport.authenticate("jwt", { session: false }), upload.single('imgFile'),actualizarPopup);
router.delete('/popups/:id', passport.authenticate("jwt", { session: false }), eliminarPopup);
router.get('/popups/:id', leerPopup);
router.put('/autorizarpopups/:id', passport.authenticate("jwt", { session: false }), autorizarPopup);
router.put('/activarpopups/:id', passport.authenticate("jwt", { session: false }), activarPopup);
router.put('/desactivarpopups/:id', passport.authenticate("jwt", { session: false }), desactivarPopup);
export default router