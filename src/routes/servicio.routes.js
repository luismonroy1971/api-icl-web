import { Router } from 'express';
import { crearServicio, actualizarServicio, acumularValoresDeServicio, obtenerValorDeServicio, autorizarServicio, leerServicio, leerServicios, eliminarServicio, buscarServicios, activarServicio, desactivarServicio } from '../controllers/servicios.controller.js'
const router = Router();
// router.get('/servicios',leerServicios);
router.get('/servicios',buscarServicios);
router.get('/leerservicios',leerServicios);
router.get('/calculoservicios',obtenerValorDeServicio);
router.get('/sumarsubservicios',acumularValoresDeServicio);
router.post('/servicios', crearServicio);
router.put('/servicios/:id',actualizarServicio);
router.delete('/servicios/:id',eliminarServicio);
router.get('/servicios/:id', leerServicio);
router.put('/autorizarservicios/:id',autorizarServicio);
router.put('/activarservicios/:id',activarServicio);
router.put('/desactivarservicios/:id',desactivarServicio);
export default router