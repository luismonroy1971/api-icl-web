import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { crearTipoDocumento, actualizarTipoDocumento, leerTipoDocumento, leerTipoDocumentos, eliminarTipoDocumento,activarTipoDocumento, desactivarTipoDocumento } from '../controllers/tipodocumento.controller.js'
const router = Router();
router.get('/documentostipo/',leerTipoDocumentos);
router.post('/documentostipo/', passport.authenticate("jwt", { session: false }), crearTipoDocumento);
router.put('/documentostipo/:id', passport.authenticate("jwt", { session: false }), actualizarTipoDocumento);
router.delete('/documentostipo/:id', passport.authenticate("jwt", { session: false }), eliminarTipoDocumento);
router.get('/documentostipo/:id', leerTipoDocumento);
router.put('/activartipodedocumento/:id', passport.authenticate("jwt", { session: false }),  activarTipoDocumento);
router.put('/desactivartipodedocumento/:id', passport.authenticate("jwt", { session: false }),  desactivarTipoDocumento);
export default router