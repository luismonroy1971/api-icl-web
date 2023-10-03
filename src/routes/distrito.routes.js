import { Router } from 'express';
import { crearDistrito,actualizarDistrito,eliminarDistrito,leerDistritos, leerDistrito, distritosConvenio } from '../controllers/distritos.controller.js'
const router = Router();
router.get('/distritos',leerDistritos);
router.get('/distritosconvenio',distritosConvenio);
router.post('/distritos', crearDistrito);
router.put('/distritos/:id',actualizarDistrito);
router.delete('/distritos/:id',eliminarDistrito);
router.get('/distritos/:id', leerDistrito);

export default router