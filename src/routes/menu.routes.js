import { Router } from 'express';
import { crearMenu, leerMenu, eliminarMenu, actualizarMenu, buscarMenus } from '../controllers/menus.controller.js'
const router = Router();
router.get('/menus',buscarMenus);
router.post('/menus', crearMenu);
router.put('/menus/:id',actualizarMenu);
router.delete('/menus/:id',eliminarMenu);
router.get('/menus/:id', leerMenu);
export default router