import { Router } from 'express';
import { crearProvincia,actualizarProvincia,eliminarProvincia,leerProvincias, leerProvincia, provinciasConvenio } from '../controllers/provincias.controller.js'
const router = Router();
router.get('/provincias',leerProvincias);
router.get('/provinciasconvenio',provinciasConvenio);
router.post('/provincias', crearProvincia);
router.put('/provincias/:id',actualizarProvincia);
router.delete('/provincias/:id',eliminarProvincia);
router.get('/provincias/:id', leerProvincia);

export default router