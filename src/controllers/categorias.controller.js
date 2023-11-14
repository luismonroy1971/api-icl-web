import {Categoria} from '../models/Categoria.js';
import { Op } from 'sequelize';

export const leerCategorias = async (req, res) => {
  try {
    const { activo } = req.params;
    const whereClause = activo ? { activo } : {};

    const categorias = await Categoria.findAll({
      where: whereClause,
      order: [['id', 'ASC']],
    });

    res.json(categorias);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
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

export const crearCategoria = async (req, res) => {
  const { descripcion_categoria } = req.body;

  try {
      // Verificar si ya existe una categoría con la misma descripción
      const categoriaExistente = await Categoria.findOne({
          where: {
              descripcion_categoria: descripcion_categoria
          }
      });

      // Si ya existe, enviar un mensaje de error
      if (categoriaExistente) {
          return res.status(400).json({ mensaje: 'La descripción de la categoría ya está registrada.' });
      }

      // Si no existe, crear la nueva categoría
      const nuevaCategoria = await Categoria.create({
          descripcion_categoria
      });

      // Enviar mensaje de éxito
      res.json({ mensaje: 'Categoría creada correctamente', nuevaCategoria });
  } catch (error) {
      return res.status(500).json({ mensaje: error.message });
  }
};


export const actualizarCategoria = async (req, res) => {
  const { id } = req.params;
  const { descripcion_categoria, activo } = req.body;

  try {
      // Buscar la categoría por su ID
      const categoria = await Categoria.findByPk(id);

      if (!categoria) {
          return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }

      // Verificar si ya existe otra categoría con la misma descripción
      const categoriaExistente = await Categoria.findOne({
          where: {
              [Op.and]: [
                  { [Op.not]: { id: categoria.id } }, // Excluir la categoría actual
                  { descripcion_categoria: descripcion_categoria }
              ]
          }
      });

      // Si se encuentra otra categoría existente, enviar un mensaje de error
      if (categoriaExistente) {
          return res.status(400).json({ mensaje: 'La descripción de la categoría ya está registrada.' });
      }

      // Actualizar la categoría si no hay conflictos
      categoria.descripcion_categoria = descripcion_categoria;
      categoria.activo = activo;

      await categoria.save();

      return res.json({ mensaje: 'Categoría actualizada con éxito' });
  } catch (error) {
      return res.status(500).json({ mensaje: error.message });
  }
};



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

export const activarCategoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const categoria = await Categoria.findByPk(id);
  
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
  
      categoria.activo = '1'; // Establecer activo en '1'
      await categoria.save();
  
      res.json({ mensaje: 'Categoría activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarCategoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const categoria = await Categoria.findByPk(id);
  
      if (!categoria) {
        return res.status(404).json({ mensaje: 'Categoría no encontrada' });
      }
  
      categoria.activo = '0'; // Establecer activo en '0'
      await categoria.save();
  
      res.json({ mensaje: 'Categoría desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };