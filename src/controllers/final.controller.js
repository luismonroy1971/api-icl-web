import {Final} from '../models/Final.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerFinales = async (req, res) =>{
    try {
        const finales = await Final.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(finales);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerFinal = async (req, res) =>{
    const { id } = req.params;
    try {
        const final = await Final.findOne({
            where:{
                id
            }
        })
        res.json(final);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearFinal = async (req, res) => {
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
                url_documento = await guardarArchivo('finales', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva final en la base de datos
        const nuevaFinal = await Final.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva final creada
        return res.status(201).json({ mensaje: 'Resultado Final creado con éxito', nuevaFinal });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear resultado final', error: error.message });
    }
};


export const actualizarFinal = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la final se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la final con el ID dado existe
        const finalExistente = await Final.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!finalExistente) {
            return res.status(404).json({ mensaje: 'Resultado Final no encontrada' });
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
                url_documento = await guardarArchivo('finales', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la final en la base de datos
        const [numRowsUpdated, [finalActualizada]] = await Final.update(
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
            return res.status(404).json({ mensaje: 'No se encontró el resultado final para actualizar' });
        }

        // Responder con la final actualizada
        return res.status(200).json({ mensaje: 'Resultado final actualizado con éxito', finalActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar resultado final', error: error.message });
    }
};


export const eliminarFinal = async (req, res) =>{

    try {
        const { id } = req.params
        await Final.destroy({
            where:{
                id,
            }
        })
        return res.status(204).json({ mensaje: 'Resultado Final eliminado'});
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
  
  export const activarFinal = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const final = await Final.findByPk(id);
  
      if (!final) {
        return res.status(404).json({ mensaje: 'Resultado Final no encontrado' });
      }
  
      final.activo = '1'; // Establecer activo en '1'
      await final.save();
  
      res.json({ mensaje: 'Resultado Final activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarFinal = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const final = await Final.findByPk(id);
  
      if (!final) {
        return res.status(404).json({ mensaje: 'Resultado Final no encontrada' });
      }
  
      final.activo = '0'; // Establecer activo en '0'
      await final.save();
  
      res.json({ mensaje: 'Resultado Final desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };