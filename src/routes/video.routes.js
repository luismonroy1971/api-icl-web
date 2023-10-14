import { Router } from 'express';
import {crearVideo, buscarVideos, leerVideo, eliminarVideo, autorizarVideo, actualizarVideo, activarVideo, desactivarVideo} from '../controllers/videos.controller.js'
const router = Router();
// router.get('/videos',leerVideos);
router.get('/videos',buscarVideos);
router.post('/videos', crearVideo);
router.put('/videos/:id',actualizarVideo);
router.delete('/videos/:id',eliminarVideo);
router.get('/videos/:id', leerVideo);
router.put('/autorizarvideo/:id',autorizarVideo);
router.put('/activarvideo/:id',activarVideo);
router.put('/desactivarvideo/:id',desactivarVideo);
export default router