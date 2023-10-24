import { Router } from 'express';
import { crearRendicion, leerRendicion, obtenerPeriodos, autorizarRendicion, eliminarRendicion, actualizarRendicion, buscarRendiciones, activarRendicion, desactivarRendicion } from '../controllers/rendicioncuenta.controller.js'
const router = Router();
// router.get('/rendiciones',leerRendiciones);
router.get('/rendiciones',buscarRendiciones);
router.post('/rendiciones', crearRendicion);
router.put('/rendiciones/:id',actualizarRendicion);
router.delete('/rendiciones/:id',eliminarRendicion);
router.get('/rendiciones/:id', leerRendicion);
router.get('/rendicionesperiodo', obtenerPeriodos);
router.put('/autorizarrendiciones/:id',autorizarRendicion);
router.put('/activarrendiciones/:id',activarRendicion);
router.put('/desactivarrendiciones/:id',desactivarRendicion);
export default router