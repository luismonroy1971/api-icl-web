import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { crearArea,actualizarArea,eliminarArea,leerAreas, leerArea, activarArea, desactivarArea } from '../controllers/areas.controller.js'
const router = Router();
router.get('/areas',leerAreas);
router.post('/areas', passport.authenticate("jwt", { session: false }),crearArea);
router.put('/areas/:id',passport.authenticate("jwt", { session: false }),actualizarArea);
router.delete('/areas/:id',passport.authenticate("jwt", { session: false }), eliminarArea);
router.get('/areas/:id', leerArea);
router.put('/activarareas/:id',passport.authenticate("jwt", { session: false }), activarArea);
router.put('/desactivarareas/:id',passport.authenticate("jwt", { session: false }), desactivarArea);
export default router