import { Sequelize } from 'sequelize';
import {Curso} from '../models/Curso.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

import { format } from 'date-fns';

export const buscarCursos = async (req, res) => {
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

    const cursos = await Curso.findAll({
      where: Object.keys(whereClause).length === 0 ? {} : whereClause,
      order: [
        ['id', 'ASC'],
      ]
    });

    // Formatear el campo creado_fecha antes de enviar la respuesta
    const cursosFormateados = cursos.map(curso => {
      return {
        ...curso.dataValues,
        creado_fecha: curso.creado_fecha ? format(curso.creado_fecha, 'dd/MM/yyyy') : null,
      };
    });

    res.json(cursosFormateados);
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

export const crearCurso = async (req, res) => {
    const { flag_adjunto, video, title, content, link, creado_por,creado_fecha, activo} = req.body;
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
                url_documento = await guardarArchivo('cursos', imgFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(imgFile.path);
            }
        }

        // Crear un nuevo curso en la base de datos
        const nuevoCurso = await Curso.create({
            flag_adjunto,
            url_documento,
            contenido_documento,
            video,
            title,
            content,
            link,
            creado_por,
            creado_fecha
        });

        // Responder con el nuevo curso creado
        return res.status(201).json({ mensaje: 'Curso creado con éxito', nuevoCurso });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear curso', error: error.message });
    }
};


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


export const actualizarCurso = async (req, res) => {
  const { id } = req.params;
  const { flag_adjunto='BIN', video, title, content, link, modificado_por, modificado_fecha, activo } = req.body;
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
              url_documento = await guardarArchivo('cursos', imgFile);
          } else if (flag_adjunto === 'BIN') {
              contenido_documento = await fs.readFile(imgFile.path);
          }
      }

      // Actualizar el curso en la base de datos
      const cursoActualizado = await Curso.update({
          flag_adjunto,
          url_documento,
          contenido_documento,
          video,
          title,
          content,
          link,
          modificado_por,
          modificado_fecha,
          activo
      }, {
          where: { id },
          returning: true, // Para obtener el curso actualizado en la respuesta
      });

      if (!cursoActualizado[0]) {
          // Si no se actualizó ningún curso, devolver un mensaje de error
          return res.status(404).json({ mensaje: 'Curso no encontrado' });
      }

      // Responder con el curso actualizado
      return res.json({ mensaje: 'Curso actualizado con éxito', curso: cursoActualizado[1][0] });
  } catch (error) {
      // Manejar errores y responder con un mensaje de error
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al actualizar curso', error: error.message });
  }
};


export const autorizarCurso = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const curso = await Curso.findByPk(id);
  
  curso.autorizado = autorizado;
  curso.autorizado_por = autorizado_por;
  curso.autorizado_fecha = autorizado_fecha;
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
