import { Router } from 'express';
import { crearServicio, actualizarServicio, obtenerValorDeServicio, autorizarServicio, leerServicio, leerServicios, eliminarServicio, buscarServicios, activarServicio, desactivarServicio } from '../controllers/servicios.controller.js'
const router = Router();
// router.get('/servicios',leerServicios);
router.get('/servicios',buscarServicios);
router.get('/calculoservicios',obtenerValorDeServicio);
router.post('/servicios', crearServicio);
router.put('/servicios/:id',actualizarServicio);
router.delete('/servicios/:id',eliminarServicio);
router.get('/servicios/:id', leerServicio);
router.put('/autorizarservicio/:id',autorizarServicio);
router.put('/activarservicio/:id',activarServicio);
router.put('/desactivarservicio/:id',desactivarServicio);
export default router