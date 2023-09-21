import { Router } from 'express';
import { crearServicio, actualizarServicio, leerServicio, leerServicios, eliminarServicio } from '../controllers/servicios.controller.js'
const router = Router();
router.get('/servicios',leerServicios);
router.post('/servicios', crearServicio);
router.put('/servicios/:id',actualizarServicio);
router.delete('/servicios/:id',eliminarServicio);
router.get('/servicios/:id', leerServicio);

export default router