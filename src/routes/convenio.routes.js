import { Router } from 'express';
import { crearConvenio,actualizarConvenio,eliminarConvenio,leerConvenios, leerConvenio, buscarConvenios } from '../controllers/convenios.controller.js'
const router = Router();
// router.get('/convenios',leerConvenios);
router.get('/convenios',buscarConvenios);
router.post('/convenios', crearConvenio);
router.put('/convenios/:id',actualizarConvenio);
router.delete('/convenios/:id',eliminarConvenio);
router.get('/convenios/:id', leerConvenio);

export default router