import { Router } from 'express';
import multer from 'multer'; 
import passport from "passport";
import '../middlewares/passport.js';
import {crearVideo, buscarVideos, leerVideo, eliminarVideo, autorizarVideo, actualizarVideo, activarVideo, desactivarVideo} from '../controllers/videos.controller.js'
const router = Router();

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });
// router.get('/videos',leerVideos);
router.get('/videos',buscarVideos);
router.post('/videos', passport.authenticate("jwt", { session: false }), upload.single('imgFile'), crearVideo);
router.put('/videos/:id', passport.authenticate("jwt", { session: false }), upload.single('imgFile'), actualizarVideo);
router.delete('/videos/:id', passport.authenticate("jwt", { session: false }), eliminarVideo);
router.get('/videos/:id', leerVideo);
router.put('/autorizarvideos/:id', passport.authenticate("jwt", { session: false }), autorizarVideo);
router.put('/activarvideos/:id', passport.authenticate("jwt", { session: false }), activarVideo);
router.put('/desactivarvideos/:id', passport.authenticate("jwt", { session: false }), desactivarVideo);
export default router