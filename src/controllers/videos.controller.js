import { Sequelize } from 'sequelize';
import {Video} from '../models/Video.js';

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

export const buscarVideos = async (req, res) => {
    const { fecha_video, id_categoria_video, titulo_video, descripcion_video, autorizado } = req.query;
  
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

      whereClause.activo = '1';
  
      const videos = await Video.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(videos);
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
    const {titulo_video, descripcion_video, fecha_video, url_imagen_video, url_video, id_categoria_video, creado_por, creado_fecha  } = req.body;
    try {
        const nuevoVideo = await Video.create({
            titulo_video, 
            descripcion_video, 
            fecha_video, 
            url_imagen_video, 
            url_video,
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
        tituloVideo, 
        descripcionVideo, 
        fechaVideo, 
        urlImagenVideo, 
        urlVideo, 
        idCategoriaVideo,
        modificado_por, 
        modificado_fecha,
        activo
     } = req.body;

    try {
    const video = await Video.findByPk(id);
    
    video.tituloVideo = tituloVideo;
    video.descripcionVideo = descripcionVideo;
    video.fechaVideo = fechaVideo;
    video.urlImagenVideo = urlImagenVideo;
    video.urlVideo = urlVideo;
    video.idCategoriaVideo = idCategoriaVideo;
    video.modificado_por = modificado_por;
    video.modificado_fecha = modificado_fecha;
    video.activo = activo;
    await video.save(); 
    res.send('Video actualizado');
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
