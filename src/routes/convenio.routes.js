import { Router } from 'express';
import { crearConvenio,actualizarConvenio,eliminarConvenio,leerConvenios, leerConvenio } from '../controllers/convenios.controller.js'
const router = Router();
router.get('/convenios',leerConvenios);
router.post('/convenios', crearConvenio);
router.put('/convenios/:id',actualizarConvenio);
router.delete('/convenios/:id',eliminarConvenio);
router.get('/convenios/:id', leerConvenio);

export default router