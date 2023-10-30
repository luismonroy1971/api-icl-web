import { Sequelize } from 'sequelize';
import { ImagenNoticia } from '../models/ImagenNoticia.js';
import {Noticia} from '../models/Noticia.js';

export const leerNoticias = async (req, res) =>{
    try {
        const noticias = await Noticia.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(noticias);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarNoticias = async (req, res) => {
  const { fecha_noticia, id_categoria_noticia, titulo_noticia, descripcion_noticia, autorizado, activo } = req.query;

  try {
    const whereClause = {};

    if (fecha_noticia) {
      whereClause.fecha_noticia = fecha_noticia;
    }

    if (autorizado) {
      whereClause.autorizado = autorizado;
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

    if (activo) {
      whereClause.activo = activo;
    }
    
    const noticias = await Noticia.findAll({
      where: Object.keys(whereClause).length === 0 ? {} : whereClause,
      order: [
        ['id', 'ASC'],
      ]
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
    const {titulo_noticia, descripcion_noticia, fecha_noticia, url_imagen_portada, id_categoria_noticia, creado_por, creado_fecha  } = req.body;
    try {
        const nuevaNoticia = await Noticia.create({
            titulo_noticia, 
            descripcion_noticia, 
            fecha_noticia, 
            url_imagen_portada, 
            id_categoria_noticia,
            creado_por, 
            creado_fecha
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
        modificado_por, 
        modificado_fecha,
        activo
     } = req.body;

    try {
    const noticia = await Noticia.findByPk(id);
    
    noticia.titulo_noticia = titulo_noticia;
    noticia.descripcion_noticia = descripcion_noticia;
    noticia.fecha_noticia = fecha_noticia;
    noticia.url_imagen_portada = url_imagen_portada;
    noticia.id_categoria_noticia = id_categoria_noticia;
    noticia.modificado_por = modificado_por;
    noticia.modificado_fecha = modificado_fecha;
    noticia.autorizado = '0';
    noticia.autorizado_por = null;
    noticia.autorizado_fecha = null;
    noticia.activo = activo;
    await noticia.save(); 
    res.send('Noticia actualizada');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}


export const autorizarNoticia = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {
  const noticia = await Noticia.findByPk(id);
  noticia.autorizado = autorizado;
  noticia.autorizado_por = autorizado_por;
  noticia.autorizado_fecha = autorizado_fecha;
  await noticia.save(); 
  res.send('Noticia autorizada / desautorizada');
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

export const activarNoticia = async (req, res) => {
  try {
    const { id } = req.params; 

    const noticia = await Noticia.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }

    noticia.activo = '1'; // Establecer activo en '1'
    await noticia.save();

    res.json({ mensaje: 'Noticia activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarNoticia = async (req, res) => {
  try {
    const { id } = req.params; 

    const noticia = await Noticia.findByPk(id);

    if (!noticia) {
      return res.status(404).json({ mensaje: 'Noticia no encontrada' });
    }

    noticia.activo = '0'; // Establecer activo en '0'
    await noticia.save();

    res.json({ mensaje: 'Noticia desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
