import { Router } from 'express';
import { crearResolucion,actualizarResolucion,eliminarResolucion,leerResoluciones, leerResolucion } from '../controllers/resoluciones.controller.js'
const router = Router();
router.get('/resoluciones',leerResoluciones);
router.post('/resoluciones', crearResolucion);
router.put('/resoluciones/:id',actualizarResolucion);
router.delete('/resoluciones/:id',eliminarResolucion);
router.get('/resoluciones/:id', leerResolucion);

export default router