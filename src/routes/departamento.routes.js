import { Router } from 'express';
import { crearDepartamento,actualizarDepartamento,eliminarDepartamento,leerDepartamentos, leerDepartamento } from '../controllers/departamentos.controller.js'
const router = Router();
router.get('/departamentos',leerDepartamentos);
router.post('/departamentos', crearDepartamento);
router.put('/departamentos/:id',actualizarDepartamento);
router.delete('/departamentos/:id',eliminarDepartamento);
router.get('/departamentos/:id', leerDepartamento);

export default router