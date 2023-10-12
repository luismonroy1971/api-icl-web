import { Sequelize } from 'sequelize';
import {Proyecto} from '../models/Proyecto.js';

export const leerProyectos = async (req, res) =>{
    try {
        const proyectos = await Proyecto.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(proyectos);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarProyectos = async (req, res) => {
    const { title, content } = req.query;
  
    try {
      const whereClause = {};
  
      if (title) {
        whereClause.title = title;
      }
  
      if (content) {
        whereClause.content = {
          [Sequelize.Op.like]: `%${content}%`
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
    const {image, video, title, content, link } = req.body;
    try {
        const nuevoProyecto = await Proyecto.create({
          image,
          video,
          title,
          content,
          link
        })
        res.json(nuevoProyecto);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarProyecto = async (req, res) =>{
    const { id } = req.params;
    const { image, video, title, content, link, autorizado, autorizado_por, activo } = req.body;

    try{
    const proyecto = await Proyecto.findByPk(id);
    
    proyecto.image = image;
    proyecto.video = video;
    proyecto.title = title;
    proyecto.content = content;
    proyecto.link = link
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
