import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import {crearVideo, buscarVideos, leerVideo, eliminarVideo, autorizarVideo, actualizarVideo, activarVideo, desactivarVideo} from '../controllers/videos.controller.js'
const router = Router();
// router.get('/videos',leerVideos);
router.get('/videos',buscarVideos);
router.post('/videos', passport.authenticate("jwt", { session: false }), crearVideo);
router.put('/videos/:id', passport.authenticate("jwt", { session: false }), actualizarVideo);
router.delete('/videos/:id', passport.authenticate("jwt", { session: false }), eliminarVideo);
router.get('/videos/:id', leerVideo);
router.put('/autorizarvideos/:id', passport.authenticate("jwt", { session: false }), autorizarVideo);
router.put('/activarvideos/:id', passport.authenticate("jwt", { session: false }), activarVideo);
router.put('/desactivarvideos/:id', passport.authenticate("jwt", { session: false }), desactivarVideo);
export default router