import { Router } from 'express';
import { crearFuncionario, leerFuncionario, leerFuncionarios, autorizarFuncionario, eliminarFuncionario, actualizarFuncionario, buscarFuncionarios, activarFuncionario, desactivarFuncionario } from '../controllers/funcionarios.controller.js'
const router = Router();
// router.get('/funcionarios',leerFuncionarios);
router.get('/funcionarios',buscarFuncionarios);
router.post('/funcionarios', crearFuncionario);
router.put('/funcionarios/:id',actualizarFuncionario);
router.delete('/funcionarios/:id',eliminarFuncionario);
router.get('/funcionarios/:id', leerFuncionario);
router.put('/autorizarfuncionario/:id',autorizarFuncionario);
router.put('/activarcurso/:id',activarFuncionario);
router.put('/desactivarcurso/:id',desactivarFuncionario);
export default router