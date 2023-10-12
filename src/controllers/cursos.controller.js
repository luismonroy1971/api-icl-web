import { Sequelize } from 'sequelize';
import {Curso} from '../models/Curso.js';

export const leerCursos = async (req, res) =>{
    try {
        const cursos = await Curso.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(cursos);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarCursos = async (req, res) => {
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
      
      const cursos = await Curso.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(cursos);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerCurso = async (req, res) =>{
    const { id } = req.params;
    try {
        const curso = await Curso.findOne({
            where:{
                id
            }
        })
        res.json(curso);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearCurso = async (req, res) =>{
    const {image, video, title, content, link } = req.body;
    try {
        const nuevoCurso = await Curso.create({
          image,
          video,
          title,
          content,
          link
        })
        res.json(nuevoCurso);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarCurso = async (req, res) =>{
    const { id } = req.params;
    const { image, video, title, content, link, autorizado, autorizado_por, activo } = req.body;

    try{
    const curso = await Curso.findByPk(id);
    
    curso.image = image;
    curso.video = video;
    curso.title = title;
    curso.content = content;
    curso.link = link
    curso.autorizado = autorizado;
    curso.autorizado_por = autorizado_por;
    curso.activo = activo;
    await curso.save(); 
    res.send('Curso actualizado');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarCurso = async (req, res) =>{

    try {
        const { id } = req.params
        await Curso.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarCurso = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const curso = await Curso.findByPk(id);
  
      if (!curso) {
        return res.status(404).json({ mensaje: 'Curso no encontrado' });
      }
  
      curso.activo = '1'; // Establecer activo en '1'
      await curso.save();
  
      res.json({ mensaje: 'Curso activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarCurso = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const curso = await Curso.findByPk(id);
  
      if (!curso) {
        return res.status(404).json({ mensaje: 'Curso no encontrado' });
      }
  
      curso.activo = '0'; // Establecer activo en '0'
      await curso.save();
  
      res.json({ mensaje: 'Curso desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
