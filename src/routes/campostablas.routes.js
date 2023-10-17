import { Router } from 'express';
import { crearCamposTabla,actualizarCamposTabla,eliminarCamposTabla,leerCamposTabla, leerCamposTablas, obtenerCamposTablasPorIdMenu } from '../controllers/campostablas.controller.js'
const router = Router();
router.get('/campostablas',leerCamposTablas);
router.post('/campostablas', crearCamposTabla);
router.put('/campostablas/:id', actualizarCamposTabla);
router.get('/camposmenu/:id_menu',obtenerCamposTablasPorIdMenu);
router.delete('/campostablas/:id', eliminarCamposTabla);
router.get('/campostablas/:id', leerCamposTabla);
export default router