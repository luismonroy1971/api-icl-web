import { Router } from 'express';
import { crearDepartamento,actualizarDepartamento,eliminarDepartamento,leerDepartamentos, leerDepartamento, departamentosConvenio } from '../controllers/departamentos.controller.js'
const router = Router();
router.get('/departamentos',leerDepartamentos);
router.get('/departamentosconvenio',departamentosConvenio);
router.post('/departamentos', crearDepartamento);
router.put('/departamentos/:id',actualizarDepartamento);
router.delete('/departamentos/:id',eliminarDepartamento);
router.get('/departamentos/:id', leerDepartamento);

export default router