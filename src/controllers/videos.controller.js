import { Sequelize } from 'sequelize';
import {Video} from '../models/Video.js';
import fs from 'fs/promises';

export const leerVideos = async (req, res) =>{
    try {
        const videos = await Video.findAll({
          where: {
            activo: '1', 
          },
        });
        res.json(videos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

import { format } from 'date-fns';

export const buscarVideos = async (req, res) => {
  const { fecha_video, id_categoria_video, titulo_video, descripcion_video, autorizado, activo } = req.query;

  try {
    const whereClause = {};

    if (fecha_video) {
      whereClause.fecha_video = fecha_video;
    }

    if (autorizado) {
      whereClause.autorizado = autorizado;
    }

    if (id_categoria_video) {
      whereClause.id_categoria_video = id_categoria_video;
    }

    if (titulo_video) {
      whereClause.titulo_video = {
        [Sequelize.Op.like]: `%${titulo_video}%`
      };
    }

    if (descripcion_video) {
      whereClause.descripcion_video = {
        [Sequelize.Op.like]: `%${descripcion_video}%`
      };
    }

    if (activo) {
      whereClause.activo = activo;
    }

    const videos = await Video.findAll({
      where: Object.keys(whereClause).length === 0 ? {} : whereClause,
      order: [
        ['orden', 'DESC'],
      ]
    });

    const videosFormateados = videos.map(video => {
      const videoJSON = video.toJSON();
      return {
        ...videoJSON,
        creado_fecha: videoJSON.creado_fecha ? format(new Date(videoJSON.creado_fecha), 'dd/MM/yyyy') : null,
      };
    });

    res.json(videosFormateados);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const leerVideo = async (req, res) =>{
    const { id } = req.params;
    try {
        const video = await Video.findOne({
            where:{
                id
            }
        })
        res.json(video);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearVideo = async (req, res) =>{
    const {titulo_video, descripcion_video, link_video, id_categoria_video, creado_por, creado_fecha  } = req.body;

      try {
        const nuevoVideo = await Video.create({
            titulo_video, 
            descripcion_video,
            link_video,
            id_categoria_video,
            creado_por, 
            creado_fecha
        })
        res.json(nuevoVideo);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarVideo = async (req, res) =>{
    const { id } = req.params;
    const { 
      titulo_video, 
      descripcion_video, 
      link_video,
      id_categoria_video,
      modificado_por, 
      modificado_fecha,
      activo
     } = req.body;

      try {

      const video = await Video.findByPk(id);
      
      video.titulo_video = titulo_video;
      video.descripcion_video = descripcion_video;
      video.link_video = link_video;
      video.id_categoria_video = id_categoria_video;
      video.modificado_por = modificado_por;
      video.modificado_fecha = modificado_fecha;
      video.autorizado = '0';
      video.autorizado_por = null;
      video.autorizado_fecha = null;
      video.activo = activo;
      await video.save(); 
      res.json({ mensaje: 'Video actualizado con éxito' });
      }
      catch(error){
          return res.status(500).json({ mensaje: error.message })
      }
}

export const autorizarVideo = async (req, res) =>{
  const { id } = req.params;
  const { 
    autorizado, autorizado_por, autorizado_fecha
   } = req.body;

  try {
  const video = await Video.findByPk(id);
  video.autorizado = autorizado;
  video.autorizado_por = autorizado_por;
  video.autorizado_fecha = autorizado_fecha;
  await video.save(); 
  res.send('Video autorizado / desautorizado');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarVideo = async (req, res) =>{

    try {
        const { id } = req.params
        await Video.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarVideo = async (req, res) => {
  try {
    const { id } = req.params; 

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ mensaje: 'Video no encontrada' });
    }

    video.activo = '1'; // Establecer activo en '1'
    await video.save();

    res.json({ mensaje: 'Video activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarVideo = async (req, res) => {
  try {
    const { id } = req.params; 

    const video = await Video.findByPk(id);

    if (!video) {
      return res.status(404).json({ mensaje: 'Video no encontrada' });
    }

    video.activo = '0'; // Establecer activo en '0'
    await video.save();

    res.json({ mensaje: 'Video desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
