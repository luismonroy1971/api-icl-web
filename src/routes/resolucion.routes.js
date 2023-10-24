import { Router } from 'express';
import { crearResolucion,actualizarResolucion,eliminarResolucion,autorizarResolucion, obtenerPeriodos, leerResolucion, buscarResoluciones, activarResolucion, desactivarResolucion } from '../controllers/resoluciones.controller.js'
const router = Router();
// router.get('/resoluciones',leerResoluciones);
router.get('/resoluciones',buscarResoluciones);
router.post('/resoluciones', crearResolucion);
router.put('/resoluciones/:id',actualizarResolucion);
router.delete('/resoluciones/:id',eliminarResolucion);
router.get('/resoluciones/:id', leerResolucion);
router.get('/resolucionesperiodo', obtenerPeriodos);
router.put('/autorizarresoluciones/:id',autorizarResolucion);
router.put('/activarresoluciones/:id',activarResolucion);
router.put('/desactivarresoluciones/:id',desactivarResolucion);
export default router