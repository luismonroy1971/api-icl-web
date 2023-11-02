import { Router } from 'express';
import { crearWhatsapp,actualizarWhatsapp,eliminarWhatsapp,leerWhatsapps, leerWhatsapp, activarWhatsapp, desactivarWhatsapp } from '../controllers/whatsapp.controller.js'
const router = Router();
router.get('/whatsapps',leerWhatsapps);
router.post('/whatsapps', crearWhatsapp);
router.put('/whatsapps/:id',actualizarWhatsapp);
router.delete('/whatsapps/:id',eliminarWhatsapp);
router.get('/whatsapps/:id', leerWhatsapp);
router.put('/activarwhatsapps/:id',activarWhatsapp);
router.put('/desactivarwhatsapps/:id',desactivarWhatsapp);
export default router