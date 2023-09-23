import { Router } from 'express';
import { crearvideo, actualizarvideo, leervideos, leervideo, eliminarvideo,leerImagenesvideo, buscarvideos } from '../controllers/videos.controller.js'
const router = Router();
// router.get('/videos',leerVideos);
router.get('/videos',buscarvideos);
router.post('/videos', crearvideo);
router.put('/videos/:id',actualizarvideo);
router.delete('/videos/:id',eliminarvideo);
router.get('/videos/:id', leervideo);
router.get('/videos/:id/imagenes', leerImagenesvideo);

export default router