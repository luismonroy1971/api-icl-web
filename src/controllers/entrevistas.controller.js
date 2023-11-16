import {Entrevista} from '../models/Entrevista.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerEntrevistas = async (req, res) =>{
    try {
        const entrevistas = await Entrevista.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(entrevistas);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerEntrevista = async (req, res) =>{
    const { id } = req.params;
    try {
        const entrevista = await Entrevista.findOne({
            where:{
                id
            }
        })
        res.json(entrevista);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearEntrevista = async (req, res) => {
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
                url_documento = await guardarArchivo('entrevistas', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva entrevista en la base de datos
        const nuevaEntrevista = await Entrevista.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva entrevista creada
        return res.status(201).json({ mensaje: 'Entrevista creado con éxito', nuevaEntrevista });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear entrevista', error: error.message });
    }
};


export const actualizarEntrevista = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la entrevista se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la entrevista con el ID dado existe
        const entrevistaExistente = await Entrevista.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!entrevistaExistente) {
            return res.status(404).json({ mensaje: 'Entrevista no encontrada' });
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
                url_documento = await guardarArchivo('entrevistas', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la entrevista en la base de datos
        const [numRowsUpdated, [entrevistaActualizada]] = await Entrevista.update(
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
            return res.status(404).json({ mensaje: 'No se encontró la entrevista para actualizar' });
        }

        // Responder con la entrevista actualizada
        return res.status(200).json({ mensaje: 'Entrevista actualizado con éxito', entrevistaActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar entrevista', error: error.message });
    }
};


export const eliminarEntrevista = async (req, res) =>{

    try {
        const { id } = req.params
        await Entrevista.destroy({
            where:{
                id,
            }
        })
        return res.status(204).json({ mensaje: 'Entrevista eliminado'});
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
  
  export const activarEntrevista = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const entrevista = await Entrevista.findByPk(id);
  
      if (!entrevista) {
        return res.status(404).json({ mensaje: 'Entrevista no encontrado' });
      }
  
      entrevista.activo = '1'; // Establecer activo en '1'
      await entrevista.save();
  
      res.json({ mensaje: 'Entrevista activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarEntrevista = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const entrevista = await Entrevista.findByPk(id);
  
      if (!entrevista) {
        return res.status(404).json({ mensaje: 'Entrevista no encontrada' });
      }
  
      entrevista.activo = '0'; // Establecer activo en '0'
      await entrevista.save();
  
      res.json({ mensaje: 'Entrevista desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };