import {Aviso} from '../models/Aviso.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerAvisos = async (req, res) =>{
    try {
        const avisos = await Aviso.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(avisos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerAviso = async (req, res) =>{
    const { id } = req.params;
    try {
        const aviso = await Aviso.findOne({
            where:{
                id
            }
        })
        res.json(aviso);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearAviso = async (req, res) => {
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
                url_documento = await guardarArchivo('avisos', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva aviso en la base de datos
        const nuevaAviso = await Aviso.create({
            url_documento,
            contenido_documento,
            pdfFile,
        });

        // Responder con la nueva aviso creada
        return res.status(201).json({ mensaje: 'Aviso creado con éxito', nuevaAviso });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear aviso', error: error.message });
    }
};


export const actualizarAviso = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la aviso se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la aviso con el ID dado existe
        const avisoExistente = await Aviso.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!avisoExistente) {
            return res.status(404).json({ mensaje: 'Aviso no encontrada' });
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
                url_documento = await guardarArchivo('avisos', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la aviso en la base de datos
        const [numRowsUpdated, [avisoActualizada]] = await Aviso.update(
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
            return res.status(404).json({ mensaje: 'No se encontró la aviso para actualizar' });
        }

        // Responder con la aviso actualizada
        return res.status(200).json({ mensaje: 'Aviso actualizado con éxito', avisoActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar aviso', error: error.message });
    }
};


export const eliminarAviso = async (req, res) =>{

    try {
        const { id } = req.params
        await Aviso.destroy({
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
  