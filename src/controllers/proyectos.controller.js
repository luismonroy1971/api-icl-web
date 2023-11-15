import { Sequelize } from 'sequelize';
import {Proyecto} from '../models/Proyecto.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

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
    const { title, content, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (title) {
        whereClause.title = title;
      }
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (content) {
        whereClause.content = {
          [Sequelize.Op.like]: `%${content}%`
        };
      }
  
      if (activo) {
        whereClause.activo = activo;
      }
      
      const proyectos = await Proyecto.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['id', 'ASC'],
        ]
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


export const crearProyecto = async (req, res) => {
  const { title, content, link, flag_adjunto, creado_por, creado_fecha } = req.body;
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
              url_documento = await guardarArchivo('proyectos', imgFile);
          } else if (flag_adjunto === 'BIN') {
              contenido_documento = await fs.readFile(imgFile.path);
          }
      }

      // Crear un nuevo proyecto en la base de datos
      const nuevoProyecto = await Proyecto.create({
          title,
          content,
          link,
          flag_adjunto,
          url_documento,
          contenido_documento,
          creado_por,
          creado_fecha
      });

      // Responder con el nuevo proyecto creado
      return res.status(201).json({ mensaje: 'Proyecto creado con éxito', nuevoProyecto });
  } catch (error) {
      // Manejar errores y responder con un mensaje de error
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al crear proyecto', error: error.message });
  }
};

// Función para guardar archivos en un directorio específico
const guardarArchivo = async (entidadDir, imgFile) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const documentosDir = path.join(__dirname, 'documentos', entidadDir);
  const originalFileName = imgFile.originalname;
  const filePath = path.join(documentosDir, originalFileName);

  await fs.mkdir(documentosDir, { recursive: true });
  await fs.copyFile(imgFile.path, filePath);

  return `${baseUrl}/documentos/${entidadDir}/${originalFileName}`;
};


export const actualizarProyecto = async (req, res) => {
  const { id } = req.params;
  const { title, content, link, flag_adjunto, modificado_por, modificado_fecha } = req.body;
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
              url_documento = await guardarArchivo('proyectos', imgFile);
          } else if (flag_adjunto === 'BIN') {
              contenido_documento = await fs.readFile(imgFile.path);
          }
      }

      // Actualizar el proyecto en la base de datos
      const proyectoActualizado = await Proyecto.update(
          {
              title,
              content,
              link,
              flag_adjunto,
              url_documento,
              contenido_documento,
              modificado_por,
              modificado_fecha,
              activo          
          },
          {
              where: { id },
          }
      );

      if (proyectoActualizado[0] === 0) {
          return res.status(404).json({ mensaje: 'No se encontró el proyecto con el ID proporcionado' });
      }

      // Obtener el proyecto actualizado después de la operación de actualización
      const proyecto = await Proyecto.findByPk(id);

      // Responder con el proyecto actualizado
      return res.json({ mensaje: 'Proyecto actualizado con éxito', proyecto });
  } catch (error) {
      // Manejar errores y responder con un mensaje de error
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al actualizar proyecto', error: error.message });
  }
};


export const autorizarProyecto = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const proyecto = await Proyecto.findByPk(id);
  
  proyecto.autorizado = autorizado;
  proyecto.autorizado_por = autorizado_por;
  proyecto.autorizado_fecha = autorizado_fecha;
  await proyecto.save(); 
  res.send('autorizada / desautorizada');
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
