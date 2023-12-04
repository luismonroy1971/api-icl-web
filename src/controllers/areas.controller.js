import {Area} from '../models/Area.js';
import { Op } from 'sequelize';

export const leerAreas = async (req, res) => {
    try {
      const { activo } = req.query;
      const whereClause = activo ? { activo } : {};
  
      const areas = await Area.findAll({
        where: whereClause,
        order: [['id', 'ASC']],
      });
  
      res.json(areas);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  }
  

export const leerArea = async (req, res) =>{
    const { id } = req.params;
    try {
        const area = await Area.findOne({
            where:{
                id
            }
        })
        res.json(area);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearArea = async (req, res) => {
  const { descripcion_area, abreviacion_area } = req.body;

  try {
      // Verificar si ya existe un área con la misma descripción o abreviación
      const areaExistente = await Area.findOne({
          where: {
              [Op.or]: [
                  { descripcion_area: descripcion_area },
                  { abreviacion_area: abreviacion_area }
              ]
          }
      });

      // Si ya existe, enviar un mensaje de error
      if (areaExistente) {
          return res.status(400).json({ mensaje: 'La descripción o abreviación del área ya está registrada.' });
      }

      // Si no existe, crear el nuevo área
      const nuevaArea = await Area.create({
          descripcion_area,
          abreviacion_area,
      });

      // Enviar mensaje de éxito
      res.status(200).json({ mensaje: 'Área creada correctamente', nuevaArea });
  } catch (error) {
      return res.status(500).json({ mensaje: error.message });
  }
};



export const actualizarArea = async (req, res) => {
  const { id } = req.params;
  const { descripcion_area, abreviacion_area, activo } = req.body;

  try {
      // Buscar el área por su ID
      const area = await Area.findByPk(id);

      if (!area) {
          return res.status(404).json({ mensaje: 'Área no encontrada' });
      }

      // Verificar si ya existe otro área con la misma descripción o abreviación
      const areaExistente = await Area.findOne({
          where: {
              [Op.and]: [
                  { [Op.not]: { id: area.id } }, // Excluir el área actual
                  {
                      [Op.or]: [
                          { descripcion_area: descripcion_area },
                          { abreviacion_area: abreviacion_area }
                      ]
                  }
              ]
          }
      });

      // Si se encuentra un área existente, enviar un mensaje de error
      if (areaExistente) {
          return res.status(400).json({ mensaje: 'La descripción o abreviación del área ya está registrada.' });
      }

      // Actualizar el área si no hay conflictos
      area.descripcion_area = descripcion_area;
      area.abreviacion_area = abreviacion_area;
      area.activo = activo;

      await area.save();

      return res.status(200).json({ mensaje: 'Área actualizada con éxito' });
  } catch (error) {
      return res.status(500).json({ mensaje: error.message });
  }
};



export const eliminarArea = async (req, res) =>{

    try {
        const { id } = req.params
        await Area.destroy({
            where:{
                id,
            }
        })
        return res.status(204).json({ mensaje: 'Área eliminada con éxito' });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarArea = async (req, res) => {
    try {
      const { id } = req.params; // ID del área a activar
  
      const area = await Area.findByPk(id);
  
      if (!area) {
        return res.status(404).json({ mensaje: 'Área no encontrada' });
      }
  
      area.activo = '1'; // Establecer activo en '1'
      await area.save();
  
      res.json({ mensaje: 'Área activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  // Función para desactivar un área
  export const desactivarArea = async (req, res) => {
    try {
      const { id } = req.params; // ID del área a desactivar
  
      const area = await Area.findByPk(id);
  
      if (!area) {
        return res.status(404).json({ mensaje: 'Área no encontrada' });
      }
  
      area.activo = '0'; // Establecer activo en '0'
      await area.save();
  
      res.json({ mensaje: 'Área desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };