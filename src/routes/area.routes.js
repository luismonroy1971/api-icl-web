import { Router } from 'express';
import { crearArea,actualizarArea,eliminarArea,leerAreas, leerArea } from '../controllers/areas.controller.js'
const router = Router();
router.get('/areas',leerAreas);
router.post('/areas', crearArea);
router.put('/areas/:id',actualizarArea);
router.delete('/areas/:id',eliminarArea);
router.get('/areas/:id', leerArea);

export default router