import { Router } from 'express';
import { crearOpcionesUsuario, leerOpcionesUsuario, eliminarOpcionesUsuario, actualizarOpcionesUsuario, buscarOpcionesUsuarios } from '../controllers/opcionesusuarios.controller.js'
const router = Router();
//router.get('/opcionesusuarios',buscarOpcionesUsuarios);
router.post('/opcionesusuarios', crearOpcionesUsuario);
router.put('/opcionesusuarios/:id',actualizarOpcionesUsuario);
router.delete('/opcionesusuarios/:id',eliminarOpcionesUsuario);
router.get('/opcionesusuarios/:id_usuario', buscarOpcionesUsuarios);
export default router