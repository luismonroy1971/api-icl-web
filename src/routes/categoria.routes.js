import { Router } from 'express';
import { actualizarCategoria, crearCategoria, eliminarCategoria, leerCategoria, leerCategorias, activarCategoria, desactivarCategoria } from '../controllers/categorias.controller.js'
const router = Router();
router.get('/categorias',leerCategorias);
router.post('/categorias', crearCategoria);
router.put('/categorias/:id',actualizarCategoria);
router.delete('/categorias/:id',eliminarCategoria);
router.get('/categorias/:id', leerCategoria);
router.put('/activarcategorias/:id',activarCategoria);
router.put('/desactivarcategorias/:id',desactivarCategoria);
export default router