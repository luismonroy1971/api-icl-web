import { Router } from 'express';
import { crearDirectiva, actualizarDirectiva, eliminarDirectiva, leerDirectiva, leerDirectivas } from '../controllers/directivas.controller.js'
const router = Router();
router.get('/directivas',leerDirectiva);
router.post('/directivas', crearDirectiva);
router.put('/directivas/:id',actualizarDirectiva);
router.delete('/directivas/:id',eliminarDirectiva);
router.get('/directivas/:id', leerDirectiva);

export default router