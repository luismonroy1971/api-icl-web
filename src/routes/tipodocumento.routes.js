import { Router } from 'express';
import { crearTipoDocumento, actualizarTipoDocumento, leerTipoDocumento, leerTipoDocumentos, eliminarTipoDocumento,activarTipoDocumento, desactivarTipoDocumento } from '../controllers/tipodocumento.controller.js'
const router = Router();
router.get('/documentostipo/',leerTipoDocumentos);
router.post('/documentostipo/', crearTipoDocumento);
router.put('/documentostipo/:id',actualizarTipoDocumento);
router.delete('/documentostipo/:id',eliminarTipoDocumento);
router.get('/documentostipo/:id', leerTipoDocumento);
router.put('/activardocumentostipos/:id', activarTipoDocumento);
router.put('/desactivardocumentostipos/:id', desactivarTipoDocumento);
export default router