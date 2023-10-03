import { Router } from 'express';
import { crearConvenio,actualizarConvenio,eliminarConvenio,obtenerPeriodos, leerConvenio, buscarConvenios, activarConvenio, desactivarConvenio } from '../controllers/convenios.controller.js'
const router = Router();
// router.get('/convenios',leerConvenios);
router.get('/convenios',buscarConvenios);
router.post('/convenios', crearConvenio);
router.put('/convenios/:id',actualizarConvenio);
router.delete('/convenios/:id',eliminarConvenio);
router.get('/convenios/:id', leerConvenio);
router.get('/conveniosperiodo', obtenerPeriodos);
router.put('/activarconvenio/:id',activarConvenio);
router.put('/desactivarconvenio/:id',desactivarConvenio);
export default router