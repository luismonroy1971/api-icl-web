import { Router } from 'express';
import { crearNoticia, actualizarNoticia, leerNoticias, leerNoticia, eliminarNoticia,leerImagenesNoticia, buscarNoticias } from '../controllers/noticias.controller.js'
const router = Router();
// router.get('/noticias',leerNoticias);
router.get('/noticias',buscarNoticias);
router.post('/noticias', crearNoticia);
router.put('/noticias/:id',actualizarNoticia);
router.delete('/noticias/:id',eliminarNoticia);
router.get('/noticias/:id', leerNoticia);
router.get('/noticias/:id/imagenes', leerImagenesNoticia);

export default router