import { Router } from 'express';
import { crearArea,actualizarArea,eliminarArea,leerAreas, leerArea, activarArea, desactivarArea } from '../controllers/areas.controller.js'
const router = Router();
router.get('/areas',leerAreas);
router.post('/areas', crearArea);
router.put('/areas/:id',actualizarArea);
router.delete('/areas/:id',eliminarArea);
router.get('/areas/:id', leerArea);
router.put('/activarareas/:id',activarArea);
router.put('/desactivarareas/:id',desactivarArea);
export default router