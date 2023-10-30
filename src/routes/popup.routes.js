import { Router } from 'express';
import { crearPopup, actualizarPopup, leerPopup, autorizarPopup, eliminarPopup, buscarPopups, activarPopup, desactivarPopup } from '../controllers/popups.controller.js'
const router = Router();
router.get('/popups',buscarPopups);
router.post('/popups', crearPopup);
router.put('/popups/:id',actualizarPopup);
router.delete('/popups/:id',eliminarPopup);
router.get('/popups/:id', leerPopup);
router.put('/autorizarpopups/:id',autorizarPopup);
router.put('/activarpopups/:id',activarPopup);
router.put('/desactivarpopups/:id',desactivarPopup);
export default router