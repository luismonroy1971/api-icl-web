import { Router } from 'express';
import passport from "passport";
import '../middlewares/passport.js';
import { actualizarCategoria, crearCategoria, eliminarCategoria, leerCategoria, leerCategorias, activarCategoria, desactivarCategoria } from '../controllers/categorias.controller.js'
const router = Router();
router.get('/categorias',leerCategorias);
router.post('/categorias', passport.authenticate("jwt", { session: false }), crearCategoria);
router.put('/categorias/:id', passport.authenticate("jwt", { session: false }), actualizarCategoria);
router.delete('/categorias/:id', passport.authenticate("jwt", { session: false }), eliminarCategoria);
router.get('/categorias/:id', leerCategoria);
router.put('/activarcategorias/:id', passport.authenticate("jwt", { session: false }), activarCategoria);
router.put('/desactivarcategorias/:id', passport.authenticate("jwt", { session: false }), desactivarCategoria);
export default router