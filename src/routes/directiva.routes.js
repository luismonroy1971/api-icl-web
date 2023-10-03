import { Router } from 'express';
import { crearDirectiva, actualizarDirectiva, eliminarDirectiva, leerDirectiva, obtenerPeriodos, buscarDirectivas, activarDirectiva, desactivarDirectiva } from '../controllers/directivas.controller.js'
const router = Router();
// router.get('/directivas',leerDirectivas);
router.get('/directivas',buscarDirectivas);
router.post('/directivas', crearDirectiva);
router.put('/directivas/:id',actualizarDirectiva);
router.delete('/directivas/:id',eliminarDirectiva);
router.get('/directivas/:id', leerDirectiva);
router.get('/directivasperiodo', obtenerPeriodos);
router.put('/activardirectiva/:id',activarDirectiva);
router.put('/desactivardirectiva/:id',desactivarDirectiva);
export default router