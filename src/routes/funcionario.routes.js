import { Router } from 'express';
import multer from 'multer'; 
import { crearFuncionario, leerFuncionario, leerFuncionarios, autorizarFuncionario, eliminarFuncionario, actualizarFuncionario, buscarFuncionarios, activarFuncionario, desactivarFuncionario } from '../controllers/funcionarios.controller.js'
const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'documentos/funcionarios/'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Usa el nombre original del archivo
    },
  });
  
  const upload = multer({ storage: storage });
// router.get('/funcionarios',leerFuncionarios);
router.get('/funcionarios',buscarFuncionarios);
router.post('/funcionarios', upload.single('imgFile'), crearFuncionario);
router.put('/funcionarios/:id',upload.single('imgFile'), actualizarFuncionario);
router.delete('/funcionarios/:id',eliminarFuncionario);
router.get('/funcionarios/:id', leerFuncionario);
router.put('/autorizarfuncionarios/:id',autorizarFuncionario);
router.put('/activarfuncionarios/:id',activarFuncionario);
router.put('/desactivarfuncionarios/:id',desactivarFuncionario);
export default router