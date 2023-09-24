import { Router } from 'express';
import { crearUit, actualizarUit, eliminarUit, leerUit, leerUits } from '../controllers/uits.controller.js'
const router = Router();
router.get('/uits',leerUits);
router.post('/uits', crearUit);
router.put('/uits/:id',actualizarUit);
router.delete('/uits/:id',eliminarUit);
router.get('/uits/:id', leerUit);

export default router