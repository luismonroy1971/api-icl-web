import {Categoria} from '../models/Categoria.js';

export const leerCategorias = async (req, res) =>{
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerCategoria = async (req, res) =>{
    const { id } = req.params;
    try {
        const categoria = await Categoria.findOne({
            where:{
                id
            }
        })
        res.json(categoria);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearCategoria = async (req, res) =>{
    const {descripcion_categoria } = req.body;
    try {
        const nuevaCategoria = await Categoria.create({
            descripcion_categoria
        })
        res.json(nuevaCategoria);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarCategoria = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_categoria, activo } = req.body;
    try {
    const categoria = await Categoria.findByPk(id);
    categoria.descripcion_categoria = descripcion_categoria;
    categoria.activo = activo;
    await categoria.save(); 
    res.send('Actualizando Categoría');
    }
      catch(error){
      return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarCategoria = async (req, res) =>{
    try {
        const { id } = req.params
        await Categoria.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}