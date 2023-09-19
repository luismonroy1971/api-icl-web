import { Router } from 'express';
import { actualizarCategoria, crearCategoria, eliminarCategoria, leerCategoria, leerCategorias } from '../controllers/categorias.controller.js'
const router = Router();
router.get('/categorias',leerCategorias);
router.post('/categorias', crearCategoria);
router.put('/categorias/:id',actualizarCategoria);
router.delete('/categorias/:id',eliminarCategoria);
router.get('/categorias/:id', leerCategoria);

export default router