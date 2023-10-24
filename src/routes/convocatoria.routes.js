import { Router } from 'express';
import { crearConvocatoria, buscarConvocatorias, autorizarConvocatoria, actualizarConvocatoria, eliminarConvocatoria, leerConvocatoria, obtenerPeriodos, activarConvocatoria, desactivarConvocatoria } from '../controllers/convocatorias.controller.js'
const router = Router();
// router.get('/convocatorias',leerConvocatorias);
router.post('/convocatorias', crearConvocatoria);
router.get('/convocatorias', buscarConvocatorias);
router.put('/convocatorias/:id',actualizarConvocatoria);
router.delete('/convocatorias/:id',eliminarConvocatoria);
router.get('/convocatorias/:id', leerConvocatoria);
router.get('/convocatoriasperiodo', obtenerPeriodos);
router.put('/autorizarconvocatorias/:id',autorizarConvocatoria);
router.put('/activarconvocatorias/:id', activarConvocatoria);
router.put('/desactivarconvocatorias/:id', desactivarConvocatoria);
export default router