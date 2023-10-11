import { Sequelize } from 'sequelize';
import {Proyecto} from '../models/Proyecto.js';

export const leerProyectos = async (req, res) =>{
    try {
        const proyectos = await Proyecto.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(normas);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarProyectos = async (req, res) => {
    const { titulo_proyecto, descripcion_proyecto } = req.query;
  
    try {
      const whereClause = {};
  
      if (titulo_proyecto) {
        whereClause.titulo_proyecto = titulo_proyecto;
      }
  
      if (descripcion_proyecto) {
        whereClause.descripcion_proyecto = {
          [Sequelize.Op.like]: `%${descripcion_proyecto}%`
        };
      }
  
      whereClause.activo = '1';
      
      const proyectos = await Proyecto.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(proyectos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerProyecto = async (req, res) =>{
    const { id } = req.params;
    try {
        const proyecto = await Proyecto.findOne({
            where:{
                id
            }
        })
        res.json(proyecto);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearProyecto = async (req, res) =>{
    const {imagen_proyecto, video_proyecto, titulo_proyecto, descripcion_proyecto, url_proyecto } = req.body;
    try {
        const nuevoProyecto = await Proyecto.create({
          imagen_proyecto,
          video_proyecto,
          titulo_proyecto,
          descripcion_proyecto,
          url_proyecto
        })
        res.json(nuevoProyecto);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarProyecto = async (req, res) =>{
    const { id } = req.params;
    const { imagen_proyecto, video_proyecto, titulo_proyecto, descripcion_proyecto, url_proyecto, autorizado, autorizado_por, activo } = req.body;

    try{
    const proyecto = await Proyecto.findByPk(id);
    
    proyecto.imagen_proyecto = imagen_proyecto;
    proyecto.video_proyecto = video_proyecto;
    proyecto.titulo_proyecto = titulo_proyecto;
    proyecto.descripcion_proyecto = descripcion_proyecto;
    proyecto.url_proyecto = url_proyecto;
    proyecto.autorizado = autorizado;
    proyecto.autorizado_por = autorizado_por;
    proyecto.activo = activo;
    await proyecto.save(); 
    res.send('Proyecto actualizado');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarProyecto = async (req, res) =>{

    try {
        const { id } = req.params
        await Proyecto.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarProyecto = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const proyecto = await Proyecto.findByPk(id);
  
      if (!proyecto) {
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
      }
  
      proyecto.activo = '1'; // Establecer activo en '1'
      await proyecto.save();
  
      res.json({ mensaje: 'Proyecto activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarProyecto = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const proyecto = await Proyecto.findByPk(id);
  
      if (!proyecto) {
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
      }
  
      proyecto.activo = '0'; // Establecer activo en '0'
      await proyecto.save();
  
      res.json({ mensaje: 'Proyecto desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
