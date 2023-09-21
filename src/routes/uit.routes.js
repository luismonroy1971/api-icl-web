import { Router } from 'express';
import { crearUit, actualizarUit, eliminarUit, leerUit, leerUits } from '../controllers/uits.controller.js'
const router = Router();
router.get('/areas',leerUits);
router.post('/areas', crearUit);
router.put('/areas/:id',actualizarUit);
router.delete('/areas/:id',eliminarUit);
router.get('/areas/:id', leerUit);

export default router