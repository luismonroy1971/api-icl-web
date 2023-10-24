import { Router } from 'express';
import { crearNorma, leerNorma, leerNormas, eliminarNorma, autorizarNorma, actualizarNorma, buscarNormas, activarNorma, desactivarNorma } from '../controllers/normainstitucional.controller.js'
const router = Router();
// router.get('/normas',leerNormas);
router.get('/normas',buscarNormas);
router.post('/normas', crearNorma);
router.put('/normas/:id',actualizarNorma);
router.delete('/normas/:id',eliminarNorma);
router.get('/normas/:id', leerNorma);
router.put('/autorizarnormas/:id',autorizarNorma);
router.put('/activarnormas/:id',activarNorma);
router.put('/desactivarnormas/:id',desactivarNorma);
export default router