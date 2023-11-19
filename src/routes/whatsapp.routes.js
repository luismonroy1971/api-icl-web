import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { crearWhatsapp,actualizarWhatsapp,eliminarWhatsapp,leerWhatsapps, leerWhatsapp, activarWhatsapp, desactivarWhatsapp } from '../controllers/whatsapp.controller.js'
const router = Router();
router.get('/whatsapps',leerWhatsapps);
router.post('/whatsapps', passport.authenticate("jwt", { session: false }), crearWhatsapp);
router.put('/whatsapps/:id', passport.authenticate("jwt", { session: false }), actualizarWhatsapp);
router.delete('/whatsapps/:id', passport.authenticate("jwt", { session: false }), eliminarWhatsapp);
router.get('/whatsapps/:id', leerWhatsapp);
router.put('/activarwhatsapps/:id', passport.authenticate("jwt", { session: false }), activarWhatsapp);
router.put('/desactivarwhatsapps/:id', passport.authenticate("jwt", { session: false }), desactivarWhatsapp);
export default router