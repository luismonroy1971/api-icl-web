import { Router } from 'express';
import { crearCurso, leerCurso, leerCursos, eliminarCurso, actualizarCurso, buscarCursos, activarCurso, desactivarCurso } from '../controllers/cursos.controller.js'
const router = Router();
// router.get('/cursos',leerCursos);
router.get('/cursos',buscarCursos);
router.post('/cursos', crearCurso);
router.put('/cursos/:id',actualizarCurso);
router.delete('/cursos/:id',eliminarCurso);
router.get('/cursos/:id', leerCurso);
router.put('/activarcurso/:id',activarCurso);
router.put('/desactivarcurso/:id',desactivarCurso);
export default router