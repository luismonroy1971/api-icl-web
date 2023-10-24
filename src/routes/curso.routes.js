import { Router } from 'express';
import { crearCurso, leerCurso, leerCursos, autorizarCurso, eliminarCurso, actualizarCurso, buscarCursos, activarCurso, desactivarCurso } from '../controllers/cursos.controller.js'
const router = Router();
// router.get('/cursos',leerCursos);
router.get('/cursos',buscarCursos);
router.post('/cursos', crearCurso);
router.put('/cursos/:id',actualizarCurso);
router.delete('/cursos/:id',eliminarCurso);
router.get('/cursos/:id', leerCurso);
router.put('/autorizarcursos/:id',autorizarCurso);
router.put('/activarcursos/:id',activarCurso);
router.put('/desactivarcursos/:id',desactivarCurso);
export default router