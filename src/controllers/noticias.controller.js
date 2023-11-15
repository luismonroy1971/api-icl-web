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
          attributes: ['id','fecha_noticia', 'id_categoria_noticia', 'titulo_noticia', 'descripcion_noticia', 'autorizado', 'activo', 'url_documento', 'contenido_documento'],
          where: Object.keys(whereClause).length === 0 ? {} : whereClause,
          order: [
              ['orden', 'DESC'],
          ]
      });

      // Mapear los resultados para agregar el campo virtual 'url_imagen_portada'
      const noticiasConUrlImagenPortada = noticias.map((noticia) => {
          const { url_documento, contenido_documento } = noticia;
          
          // Asegurarse de que contenido_documento no sea null antes de acceder a 'toString'
          const url_imagen_portada = contenido_documento ? `data:image/png;base64,${contenido_documento.toString('base64')}` : url_documento;

          return { ...noticia.toJSON(), url_imagen_portada };
      });

      res.json(noticiasConUrlImagenPortada);

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
      // Validar el tamaño del archivo adjunto
      if (imgFile && imgFile.size > 10000000) {
          return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
      }

      let url_documento = null;
      let contenido_documento = null;

      // Manejar la lógica según el tipo de adjunto (URL o BIN)
      if (imgFile) {
          if (flag_adjunto === 'URL') {
              url_documento = await guardarArchivo('noticias', imgFile);
          } else if (flag_adjunto === 'BIN') {
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

// Función para guardar archivos en un directorio específico
// Función para guardar archivos en un directorio específico
const guardarArchivo = async (entidadDir, imgFile) => {
  const documentosDir = path.join(__dirname, 'documentos', entidadDir);
  const originalFileName = imgFile.originalname;
  const filePath = path.join(documentosDir, originalFileName);

  try {
      await fs.mkdir(documentosDir, { recursive: true });
      await fs.copyFile(imgFile.path, filePath);

      return `${baseUrl}/documentos/${entidadDir}/${originalFileName}`;
  } catch (error) {
      console.error(error);
      throw error;
  }
};


export const actualizarNoticia = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la noticia se pasa como un parámetro en la URL
    const { titulo_noticia, descripcion_noticia, fecha_noticia, flag_adjunto, id_categoria_noticia, creado_por, creado_fecha } = req.body;
    const imgFile = req.file;

    try {
        // Verificar si la noticia con el ID dado existe
        const noticiaExistente = await Noticia.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!noticiaExistente) {
            return res.status(404).json({ mensaje: 'Noticia no encontrada' });
        }

        // Validar el tamaño del archivo adjunto si se proporciona uno nuevo
        if (imgFile && imgFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        let url_documento = noticiaExistente.url_documento; // Mantener la URL existente por defecto
        let contenido_documento = noticiaExistente.contenido_documento; // Mantener el contenido existente por defecto

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (imgFile) {
            if (flag_adjunto === 'URL') {
                url_documento = await guardarArchivo('noticias', imgFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(imgFile.path);
            }
        }

        // Actualizar la noticia en la base de datos
        const [numRowsUpdated, [noticiaActualizada]] = await Noticia.update(
            {
                
                titulo_noticia,
                descripcion_noticia,
                fecha_noticia,
                flag_adjunto,
                url_documento,
                contenido_documento,
                id_categoria_noticia,
                creado_por,
                creado_fecha,
            },
            {
                where: { id },  // Condición para actualizar el registro con el ID específico
                returning: true,  // Para devolver el registro actualizado
            }
        );

        // Verificar si se actualizó alguna fila
        if (numRowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la noticia para actualizar' });
        }

        // Responder con la noticia actualizada
        return res.status(200).json({ mensaje: 'Noticia actualizada con éxito', noticiaActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar noticia', error: error.message });
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
