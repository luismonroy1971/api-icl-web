import { Router } from 'express';
import { crearDirectiva, actualizarDirectiva, autorizarDirectiva, eliminarDirectiva, leerDirectiva, obtenerPeriodos, buscarDirectivas, activarDirectiva, desactivarDirectiva } from '../controllers/directivas.controller.js'
const router = Router();
// router.get('/directivas',leerDirectivas);
router.get('/directivas',buscarDirectivas);
router.post('/directivas', crearDirectiva);
router.put('/directivas/:id',actualizarDirectiva);
router.delete('/directivas/:id',eliminarDirectiva);
router.get('/directivas/:id', leerDirectiva);
router.get('/directivasperiodo', obtenerPeriodos);
router.put('/autorizardirectivas/:id',autorizarDirectiva);
router.put('/activardirectivas/:id',activarDirectiva);
router.put('/desactivardirectivas/:id',desactivarDirectiva);
export default router