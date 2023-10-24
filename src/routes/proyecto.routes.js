import { Router } from 'express';
import { crearProyecto, leerProyecto, leerProyectos, autorizarProyecto, eliminarProyecto, actualizarProyecto, buscarProyectos, activarProyecto, desactivarProyecto } from '../controllers/proyectos.controller.js'
const router = Router();
// router.get('/proyectos',leerProyectos);
router.get('/proyectos',buscarProyectos);
router.post('/proyectos', crearProyecto);
router.put('/proyectos/:id',actualizarProyecto);
router.delete('/proyectos/:id',eliminarProyecto);
router.get('/proyectos/:id', leerProyecto);
router.put('/autorizarproyectos/:id',autorizarProyecto);
router.put('/activarproyectos/:id',activarProyecto);
router.put('/desactivarproyectos/:id',desactivarProyecto);
export default router