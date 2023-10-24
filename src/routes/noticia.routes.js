import { Router } from 'express';
import { crearNoticia, actualizarNoticia, leerNoticias, autorizarNoticia, leerNoticia, eliminarNoticia,leerImagenesNoticia, buscarNoticias, activarNoticia, desactivarNoticia } from '../controllers/noticias.controller.js'
const router = Router();
// router.get('/noticias',leerNoticias);
router.get('/noticias',buscarNoticias);
router.post('/noticias', crearNoticia);
router.put('/noticias/:id',actualizarNoticia);
router.delete('/noticias/:id',eliminarNoticia);
router.get('/noticias/:id', leerNoticia);
router.get('/noticias/:id/imagenes', leerImagenesNoticia);
router.put('/autorizarnoticias/:id', autorizarNoticia);
router.put('/activarnoticias/:id',activarNoticia);
router.put('/desactivarnoticias/:id',desactivarNoticia);
export default router