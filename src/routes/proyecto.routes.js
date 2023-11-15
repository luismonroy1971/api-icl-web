import { Router } from 'express';
import multer from 'multer'; 
import { crearProyecto, leerProyecto, leerProyectos, autorizarProyecto, eliminarProyecto, actualizarProyecto, buscarProyectos, activarProyecto, desactivarProyecto } from '../controllers/proyectos.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/proyectos/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });
// router.get('/proyectos',leerProyectos);
router.get('/proyectos',buscarProyectos);
router.post('/proyectos', upload.single('imgFile'), crearProyecto);
router.put('/proyectos/:id', upload.single('imgFile'), actualizarProyecto);
router.delete('/proyectos/:id',eliminarProyecto);
router.get('/proyectos/:id', leerProyecto);
router.put('/autorizarproyectos/:id',autorizarProyecto);
router.put('/activarproyectos/:id',activarProyecto);
router.put('/desactivarproyectos/:id',desactivarProyecto);
export default router