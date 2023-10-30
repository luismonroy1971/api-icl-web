import {Area} from '../models/Area.js';

export const leerAreas = async (req, res) => {
    try {
      const { activo } = req.params;
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

export const crearArea = async (req, res) =>{
    const {descripcion_area, abreviacion_area} = req.body;
    console.log(descripcion_area, abreviacion_area)
    try {
        const nuevaArea = await Area.create({
            descripcion_area,
            abreviacion_area,
        })
        res.json(nuevaArea);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarArea = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_area, abreviacion_area, activo } = req.body;

    try{
    const area = await Area.findByPk(id);
    
    area.descripcion_area = descripcion_area;
    area.abreviacion_area = abreviacion_area;
    area.activo = activo;
    await area.save(); 
    res.send('Area actualizada');
    }
        catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarArea = async (req, res) =>{

    try {
        const { id } = req.params
        await Area.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
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