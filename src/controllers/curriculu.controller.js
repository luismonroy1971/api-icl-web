import {Curriculo} from '../models/Curriculo.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { Curriculo } from '../models/Curriculo.js';
const baseUrl = process.env.BASE_URL; 

export const leerComunicados = async (req, res) =>{
    try {
        const curriculu = await Curriculo.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(curriculu);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerCurriculo = async (req, res) =>{
    const { id } = req.params;
    try {
        const curriculu = await Curriculo.findOne({
            where:{
                id
            }
        })
        res.json(curriculu);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearCurriculo = async (req, res) => {
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
                url_documento = await guardarArchivo('curriculu', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva curriculu en la base de datos
        const nuevaCurriculo = await Curriculo.create({
            url_documento,
            contenido_documento,
            pdfFile,
        });

        // Responder con la nueva curriculu creada
        return res.status(201).json({ mensaje: 'Curriculo creado con éxito', nuevaCurriculo });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear curriculu', error: error.message });
    }
};


export const actualizarCurriculo = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la curriculu se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la curriculu con el ID dado existe
        const curriculuExistente = await Curriculo.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!curriculuExistente) {
            return res.status(404).json({ mensaje: 'Curriculo no encontrada' });
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
                url_documento = await guardarArchivo('curriculu', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la curriculu en la base de datos
        const [numRowsUpdated, [curriculuActualizada]] = await Curriculo.update(
            {
                url_documento,
                contenido_documento,
                flag_adjunto
            },
            {
                where: { id },  // Condición para actualizar el registro con el ID específico
                returning: true,  // Para devolver el registro actualizado
            }
        );

        // Verificar si se actualizó alguna fila
        if (numRowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la curriculu para actualizar' });
        }

        // Responder con la curriculu actualizada
        return res.status(200).json({ mensaje: 'Curriculo actualizado con éxito', curriculuActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar curriculu', error: error.message });
    }
};


export const eliminarCurriculo = async (req, res) =>{

    try {
        const { id } = req.params
        await Curriculo.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
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
  