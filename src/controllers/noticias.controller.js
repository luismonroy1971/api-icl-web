import { Sequelize } from 'sequelize';
import { ImagenNoticia } from '../models/ImagenNoticia.js';
import {Noticia} from '../models/Noticia.js';

export const leerNoticias = async (req, res) =>{
    try {
        const noticias = await Noticia.findAll();
        res.json(noticias);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarNoticias = async (req, res) => {
  const { fecha_noticia, id_categoria_noticia, titulo_noticia, descripcion_noticia } = req.query;

  try {
    const whereClause = {};

    if (fecha_noticia) {
      whereClause.fecha_noticia = fecha_noticia;
    }

    if (id_categoria_noticia) {
      whereClause.id_categoria_noticia = id_categoria_noticia;
    }

    if (titulo_noticia) {
      whereClause.titulo_noticia = {
        [Sequelize.Op.like]: `%${titulo_noticia}%`
      };
    }

    if (descripcion_noticia) {
      whereClause.descripcion_noticia = {
        [Sequelize.Op.like]: `%${descripcion_noticia}%`
      };
    }

    const noticias = await Noticia.findAll({
      where: Object.keys(whereClause).length === 0 ? {} : whereClause
    });

    res.json(noticias);
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


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
    const {titulo_noticia, descripcion_noticia, fecha_noticia, url_imagen_portada, id_categoria_noticia  } = req.body;
    try {
        const nuevaNoticia = await Noticia.create({
            titulo_noticia, 
            descripcion_noticia, 
            fecha_noticia, 
            url_imagen_portada, 
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
        url_imagen_portada, 
        id_categoria_noticia,
        autorizado,
        autorizado_por,
        activo
     } = req.body;

    try {
    const noticia = await Noticia.findByPk(id);
    
    noticia.titulo_noticia = titulo_noticia;
    noticia.descripcion_noticia = descripcion_noticia;
    noticia.fecha_noticia = fecha_noticia;
    noticia.url_imagen_portada = url_imagen_portada;
    noticia.id_categoria_noticia = id_categoria_noticia;
    noticia.autorizado = autorizado;
    noticia.autorizado_por = autorizado_por;
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

export const leerImagenesNoticia = async (req, res) =>{
    const { id } = req.params;
    const imagenes = await ImagenNoticia.findAll({
        where: { id_noticia: id}
    });
    res.json(imagenes);
}