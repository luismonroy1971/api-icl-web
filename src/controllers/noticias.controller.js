import {Noticia} from '../models/Noticia.js';

export const leerNoticias = async (req, res) =>{
    try {
        const noticias = await Noticia.findAll();
        res.json(noticias);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerNoticia = async (req, res) =>{
    const { id } = req.params;
    try {
        const noticia = await Noticia.findOne({
            where:{
                id
            }
        })
        res.json(noticia);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearNoticia = async (req, res) =>{
    const {titulo_noticia, descripcion_noticia, fecha_noticia, url_imagen1_noticia, url_imagen2_noticia, url_imagen3_noticia, url_imagen4_noticia, id_categoria_noticia  } = req.body;
    try {
        const nuevaNoticia = await Noticia.create({
            titulo_noticia, 
            descripcion_noticia, 
            fecha_noticia, 
            url_imagen1_noticia, 
            url_imagen2_noticia, 
            url_imagen3_noticia, 
            url_imagen4_noticia, 
            id_categoria_noticia
        })
        res.json(nuevaNoticia);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarNoticia = async (req, res) =>{
    const { id } = req.params;
    const { titulo_noticia, 
        descripcion_noticia, 
        fecha_noticia, 
        url_imagen1_noticia, 
        url_imagen2_noticia, 
        url_imagen3_noticia, 
        url_imagen4_noticia, 
        id_categoria_noticia,
        autorizado,
        autorizadoPor,
        activo
     } = req.body;

    try {
    const noticia = await Noticia.findByPk(id);
    
    noticia.titulo_noticia = titulo_noticia;
    noticia.descripcion_noticia = descripcion_noticia;
    noticia.fecha_noticia = fecha_noticia;
    noticia.url_imagen1_noticia = url_imagen1_noticia;
    noticia.url_imagen2_noticia = url_imagen2_noticia;
    noticia.url_imagen3_noticia = url_imagen3_noticia;
    noticia.url_imagen4_noticia = url_imagen4_noticia;
    noticia.id_categoria_noticia = id_categoria_noticia;
    noticia.autorizado = autorizado;
    noticia.autorizadoPor = autorizadoPor;
    noticia.activo = activo;
    await noticia.save(); 
    res.send('Noticia actualizada');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarNoticia = async (req, res) =>{

    try {
        const { id } = req.params
        await Noticia.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}