import {Video} from '../models/Video.js';

export const leerVideos = async (req, res) =>{
    try {
        const videos = await Video.findAll();
        res.json(videos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

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
    const {tituloVideo, descripcionVideo, fechaVideo, urlImagenVideo, urlVideo, idCategoriaVideo  } = req.body;
    try {
        const nuevoVideo = await Video.create({
            tituloVideo, 
            descripcionVideo, 
            fechaVideo, 
            urlImagenVideo, 
            urlVideo,
            idCategoriaVideo
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
        autorizado,
        autorizado_por,
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
    video.autorizado = autorizado;
    video.autorizado_por = autorizado_por;
    video.activo = activo;
    await video.save(); 
    res.send('Video actualizado');
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