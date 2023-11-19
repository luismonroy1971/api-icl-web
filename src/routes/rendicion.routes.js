import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import { crearRendicion, leerRendicion, obtenerPeriodos, autorizarRendicion, eliminarRendicion, actualizarRendicion, buscarRendiciones, activarRendicion, desactivarRendicion } from '../controllers/rendicioncuenta.controller.js'
const router = Router();

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});
  
  const upload = multer({ storage: storage });

// router.get('/rendiciones',leerRendiciones);
router.get('/rendiciones',buscarRendiciones);
router.post('/rendiciones', passport.authenticate("jwt", { session: false }),  upload.single('pdfFile'), crearRendicion);
router.put('/rendiciones/:id',passport.authenticate("jwt", { session: false }), upload.single('pdfFile'), actualizarRendicion);
router.delete('/rendiciones/:id', passport.authenticate("jwt", { session: false }), eliminarRendicion);
router.get('/rendiciones/:id', leerRendicion);
router.get('/rendicionesperiodo', obtenerPeriodos);
router.put('/autorizarrendiciones/:id', passport.authenticate("jwt", { session: false }), autorizarRendicion);
router.put('/activarrendiciones/:id', passport.authenticate("jwt", { session: false }), activarRendicion);
router.put('/desactivarrendiciones/:id', passport.authenticate("jwt", { session: false }), desactivarRendicion);
export default router