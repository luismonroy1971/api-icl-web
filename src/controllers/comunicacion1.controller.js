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
        const aviso = await Comunicacion1.findOne({
            where:{
                id
            }
        })
        res.json(aviso);
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

        // Crear una nueva aviso en la base de datos
        const nuevaComunicacion1 = await Comunicacion1.create({
            url_documento,
            contenido_documento,
            flag_adjunto
        });

        // Responder con la nueva aviso creada
        return res.status(201).json({ mensaje: 'Comunicacion1 creado con éxito', nuevaComunicacion1 });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear aviso', error: error.message });
    }
};


export const actualizarComunicacion1 = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la aviso se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la aviso con el ID dado existe
        const avisoExistente = await Comunicacion1.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!avisoExistente) {
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

        // Actualizar la aviso en la base de datos
        const [numRowsUpdated, [avisoActualizada]] = await Comunicacion1.update(
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
        return res.status(200).json({ mensaje: 'Comunicacion1 actualizado con éxito', avisoActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar aviso', error: error.message });
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
  