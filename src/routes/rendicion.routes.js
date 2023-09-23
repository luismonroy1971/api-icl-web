import { Router } from 'express';
import { crearRendicion, leerRendicion, leerRendiciones, eliminarRendicion, actualizarRendicion, buscarRendiciones } from '../controllers/rendicioncuenta.controller.js'
const router = Router();
// router.get('/rendiciones',leerRendiciones);
router.get('/rendiciones',buscarRendiciones);
router.post('/rendiciones', crearRendicion);
router.put('/rendiciones/:id',actualizarRendicion);
router.delete('/rendiciones/:id',eliminarRendicion);
router.get('/rendiciones/:id', leerRendicion);

export default router