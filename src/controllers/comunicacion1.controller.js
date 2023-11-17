import {Comunicacion1} from '../models/Comunicacion1.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerComunicaciones1 = async (req, res) =>{
    try {
        const comunicaciones1 = await Comunicacion1.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(comunicaciones1);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerComunicacion1 = async (req, res) =>{
    const { id } = req.params;
    try {
        const comunicacion1 = await Comunicacion1.findOne({
            where:{
                id
            }
        })
        res.json(comunicacion1);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearComunicacion1 = async (req, res) => {
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Validar el tamaño del archivo adjunto
        if (pdfFile && pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        let url_documento = null;
        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (pdfFile) {
            if (flag_adjunto === 'URL') {
                url_documento = await guardarArchivo('comunicaciones1', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevaExamen = await Comunicacion1.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Comunicacion1 creado con éxito', nuevaExamen });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear comunicacion1', error: error.message });
    }
};


export const actualizarComunicacion1 = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la comunicacion1 se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la comunicacion1 con el ID dado existe
        const comunicacionExistente = await Comunicacion1.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!comunicacionExistente) {
            return res.status(404).json({ mensaje: 'Comunicacion1 no encontrada' });
        }

        // Validar el tamaño del archivo adjunto si se proporciona uno nuevo
        if (pdfFile && pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        let url_documento = null;
        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (pdfFile) {
            if (flag_adjunto === 'URL') {
                url_documento = await guardarArchivo('comunicaciones1', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la comunicacion1 en la base de datos
        const [numRowsUpdated, [comunicacionActualizada]] = await Comunicacion1.update(
            {
                url_documento,
                contenido_documento,
                flag_adjunto,
                id_convocatoria
            },
            {
                where: { id },  // Condición para actualizar el registro con el ID específico
                returning: true,  // Para devolver el registro actualizado
            }
        );

        // Verificar si se actualizó alguna fila
        if (numRowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la comunicacion1 para actualizar' });
        }

        // Responder con la comunicacion1 actualizada
        return res.status(200).json({ mensaje: 'Comunicacion1 actualizado con éxito', comunicacionActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar comunicacion1', error: error.message });
    }
};


export const eliminarComunicacion1 = async (req, res) =>{

    try {
        const { id } = req.params
        await Comunicacion1.destroy({
            where:{
                id,
            }
        })
        return res.status(204).json({ mensaje: 'Comunicacion1 eliminado'});
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

const guardarArchivo = async (entidadDir, pdfFile) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const documentosDir = path.join(__dirname, 'documentos', entidadDir);
    const originalFileName = pdfFile.originalname;
    const filePath = path.join(documentosDir, originalFileName);
  
    await fs.mkdir(documentosDir, { recursive: true });
    await fs.copyFile(pdfFile.path, filePath);
  
    return `${baseUrl}/documentos/${entidadDir}/${originalFileName}`;
  };
  
  export const activarComunicacion1 = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const comunicacion1 = await Comunicacion1.findByPk(id);
  
      if (!comunicacion1) {
        return res.status(404).json({ mensaje: 'Comunicacion1 no encontrado' });
      }
  
      comunicacion1.activo = '1'; // Establecer activo en '1'
      await comunicacion1.save();
  
      res.json({ mensaje: 'Comunicacion1 activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarComunicacion1 = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const comunicacion1 = await Comunicacion1.findByPk(id);
  
      if (!comunicacion1) {
        return res.status(404).json({ mensaje: 'Comunicacion1 no encontrada' });
      }
  
      comunicacion1.activo = '0'; // Establecer activo en '0'
      await comunicacion1.save();
  
      res.json({ mensaje: 'Comunicacion1 desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };