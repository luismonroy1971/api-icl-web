import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { crearConvocatoria, buscarConvocatorias, autorizarConvocatoria, actualizarConvocatoria, eliminarConvocatoria, leerConvocatoria, obtenerPeriodos, activarConvocatoria, desactivarConvocatoria } from '../controllers/convocatorias.controller.js'
const router = Router();

// router.get('/convocatorias',leerConvocatorias);
router.post('/convocatorias', passport.authenticate("jwt", { session: false }), crearConvocatoria);
router.get('/convocatorias', buscarConvocatorias);
router.put('/convocatorias/:id', passport.authenticate("jwt", { session: false }), actualizarConvocatoria);
router.delete('/convocatorias/:id', passport.authenticate("jwt", { session: false }), eliminarConvocatoria);
router.get('/convocatorias/:id', leerConvocatoria);
router.get('/convocatoriasperiodo', obtenerPeriodos);
router.put('/autorizarconvocatorias/:id', passport.authenticate("jwt", { session: false }), autorizarConvocatoria);
router.put('/activarconvocatorias/:id', passport.authenticate("jwt", { session: false }), activarConvocatoria);
router.put('/desactivarconvocatorias/:id', passport.authenticate("jwt", { session: false }),desactivarConvocatoria);
export default router