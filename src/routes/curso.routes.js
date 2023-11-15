import { Router } from 'express';
import multer from 'multer'; 
import { crearCurso, leerCurso, leerCursos, autorizarCurso, eliminarCurso, actualizarCurso, buscarCursos, activarCurso, desactivarCurso } from '../controllers/cursos.controller.js'
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos/cursos/'); // Ruta donde se guardarán los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa el nombre original del archivo
  },
});

const upload = multer({ storage: storage });
// router.get('/cursos',leerCursos);
router.get('/cursos',buscarCursos);
router.post('/cursos', upload.single('imgFile'), crearCurso);
router.put('/cursos/:id', upload.single('imgFile'), actualizarCurso);
router.delete('/cursos/:id',eliminarCurso);
router.get('/cursos/:id', leerCurso);
router.put('/autorizarcursos/:id',autorizarCurso);
router.put('/activarcursos/:id',activarCurso);
router.put('/desactivarcursos/:id',desactivarCurso);
export default router