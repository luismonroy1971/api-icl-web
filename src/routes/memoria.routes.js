import { Router } from 'express';
import { crearMemoria, actualizarMemoria, leerMemoria, leerMemorias, obtenerPeriodos, eliminarMemoria, buscarMemorias, activarMemoria, desactivarMemoria } from '../controllers/memorias.controller.js'
const router = Router();
// router.get('/memorias',leerServicios);
router.get('/memorias',buscarMemorias);
router.post('/memorias', crearMemoria);
router.put('/memorias/:id',actualizarMemoria);
router.delete('/memorias/:id',eliminarMemoria);
router.get('/memorias/:id', leerMemoria);
router.get('/memoriasperiodo', obtenerPeriodos);
router.put('/activarmemoria/:id',activarMemoria);
router.put('/desactivarmemoria/:id',desactivarMemoria);
export default router