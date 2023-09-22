import { Router } from 'express';
import { crearNorma, leerNorma, leerNormas, eliminarNorma, actualizarNorma } from '../controllers/normainstitucional.controller.js'
const router = Router();
router.get('/normas',leerNormas);
router.post('/normas', crearNorma);
router.put('/normas/:id',actualizarNorma);
router.delete('/normas/:id',eliminarNorma);
router.get('/normas/:id', leerNorma);

export default router