import { Router } from 'express';
import { crearConvocatoria, actualizarConvocatoria, eliminarConvocatoria, leerConvocatoria, leerConvocatorias } from '../controllers/convocatorias.controller.js'
const router = Router();
router.get('/convocatorias',leerConvocatorias);
router.post('/convocatorias', crearConvocatoria);
router.put('/convocatorias/:id',actualizarConvocatoria);
router.delete('/convocatorias/:id',eliminarConvocatoria);
router.get('/convocatorias/:id', leerConvocatoria);

export default router