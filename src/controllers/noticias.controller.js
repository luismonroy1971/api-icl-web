import { Sequelize } from 'sequelize';
import { ImagenNoticia } from '../models/ImagenNoticia.js';
import {Noticia} from '../models/Noticia.js';

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

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
        ['orden', 'DESC'],
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


export const crearNoticia = async (req, res) => {
    const { titulo_noticia, descripcion_noticia, fecha_noticia, flag_adjunto, id_categoria_noticia, creado_por, creado_fecha } = req.body;
    
    const imgFile = req.file;

    try {
        let url_documento = null;
        let contenido_documento = null;

        // Validar el tamaño del archivo adjunto
        if (imgFile && imgFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (imgFile) {
          if (flag_adjunto === 'URL') {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'noticias');
            const originalFileName = imgFile.originalname;
            const filePath = path.join(documentosDir, originalFileName);
            await fs.mkdir(documentosDir, { recursive: true });
            await fs.copyFile(imgFile.path, filePath);
            url_documento = `${baseUrl}/documentos/noticias/${originalFileName}`;
          } else if (flag_adjunto === 'BIN') {
              // Leer el contenido del archivo
              contenido_documento = await fs.readFile(imgFile.path);
          }
                    }

        // Crear una nueva noticia en la base de datos
        const nuevaNoticia = await Noticia.create({
            titulo_noticia,
            descripcion_noticia,
            fecha_noticia,
            flag_adjunto,
            url_documento,
            contenido_documento,
            id_categoria_noticia,
            creado_por,
            creado_fecha,
        });

        // Responder con la nueva noticia creada
        return res.status(201).json({ mensaje: 'Noticia creada con éxito', nuevaNoticia });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear noticia', error: error.message });
    }
};



export const actualizarNoticia = async (req, res) => {
    const { id } = req.params;
    const { titulo_noticia, descripcion_noticia, fecha_noticia, flag_adjunto, url_documento, id_categoria_noticia, modificado_por, modificado_fecha, activo } = req.body;
    const imgFile = req.file;

    try {
        // Buscar la noticia por su ID
        const noticia = await Noticia.findByPk(id);

        // Verificar si la noticia existe
        if (!noticia) {
            return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        }

        // Validar el tamaño del archivo adjunto
        if (imgFile && imgFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        // Actualizar las propiedades de la noticia
        noticia.titulo_noticia = titulo_noticia;
        noticia.descripcion_noticia = descripcion_noticia;
        noticia.fecha_noticia = fecha_noticia;
        noticia.id_categoria_noticia = id_categoria_noticia;
        noticia.modificado_por = modificado_por;
        noticia.modificado_fecha = modificado_fecha;
        noticia.autorizado = '0';
        noticia.autorizado_por = null;
        noticia.autorizado_fecha = null;
        noticia.activo = activo;

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (imgFile) {
          const __dirname = path.dirname(fileURLToPath(import.meta.url));
          const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'noticias');
          const originalFileName = imgFile.originalname;
          const filePath = path.join(documentosDir, originalFileName);

          if (flag_adjunto === 'URL') {
              // Crear el directorio si no existe y copiar el archivo
              await fs.mkdir(documentosDir, { recursive: true });
              await fs.copyFile(imgFile.path, filePath);
              noticia.url_documento = `${baseUrl}/documentos/noticias/${originalFileName}`;
              noticia.contenido_documento = null;
              noticia.flag_adjunto = "URL";
          } else if (flag_adjunto === 'BIN') {
              // Leer el contenido del archivo
              noticia.url_documento = null;
              noticia.contenido_documento = await fs.readFile(imgFile.path);
              noticia.flag_adjunto = "BIN";
          }
        }

        // Guardar los cambios en la base de datos
        await noticia.save();

        // Responder con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Noticia actualizada correctamente' });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al modificar noticia', error: error.message });
    }
};



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
