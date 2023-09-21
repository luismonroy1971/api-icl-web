import { Router } from 'express';
import { crearImagen,actualizarImagen, eliminarImagen, leerImagen, leerImagenes } from '../controllers/noticiaimagen.controller.js'
const router = Router();
router.get('/imagenes',leerImagenes);
router.post('/imagenes', crearImagen);
router.put('/imagenes/:id',actualizarImagen);
router.delete('/imagenes/:id',eliminarImagen);
router.get('/imagenes/:id', leerImagen);

export default router