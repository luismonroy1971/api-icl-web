import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { crearServicio, actualizarServicio, acumularValoresDeServicio, obtenerValorDeServicio, autorizarServicio, leerServicio, leerServicios, eliminarServicio, buscarServicios, activarServicio, desactivarServicio } from '../controllers/servicios.controller.js'
const router = Router();
// router.get('/servicios',leerServicios);
router.get('/servicios',buscarServicios);
router.get('/leerservicios',leerServicios);
router.get('/calculoservicios',obtenerValorDeServicio);
router.get('/sumarsubservicios',acumularValoresDeServicio);
router.post('/servicios', passport.authenticate("jwt", { session: false }),  crearServicio);
router.put('/servicios/:id', passport.authenticate("jwt", { session: false }),  actualizarServicio);
router.delete('/servicios/:id', passport.authenticate("jwt", { session: false }),  eliminarServicio);
router.get('/servicios/:id', leerServicio);
router.put('/autorizarservicios/:id', passport.authenticate("jwt", { session: false }),  autorizarServicio);
router.put('/activarservicios/:id', passport.authenticate("jwt", { session: false }),  activarServicio);
router.put('/desactivarservicios/:id', passport.authenticate("jwt", { session: false }),  desactivarServicio);
export default router