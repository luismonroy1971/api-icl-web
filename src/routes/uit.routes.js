import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { crearUit, actualizarUit, eliminarUit, leerUit, leerUits, desactivarUit, activarUit } from '../controllers/uits.controller.js'
const router = Router();
router.get('/uits',leerUits);
router.post('/uits', passport.authenticate("jwt", { session: false }),  crearUit);
router.put('/uits/:id',passport.authenticate("jwt", { session: false }), actualizarUit);
router.delete('/uits/:id',passport.authenticate("jwt", { session: false }), eliminarUit);
router.get('/uits/:id', leerUit);
router.put('/activaruits/:id',passport.authenticate("jwt", { session: false }), activarUit);
router.put('/desactivaruits/:id',passport.authenticate("jwt", { session: false }), desactivarUit);
export default router