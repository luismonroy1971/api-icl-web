import {ImagenNoticia} from '../models/ImagenNoticia.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerImagenes = async (req, res) =>{
    try {
        const imagenes = await ImagenNoticia.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(imagenes);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerImagen = async (req, res) =>{
    const { id } = req.params;
    try {
        const imagen = await ImagenNoticia.findOne({
            where:{
                id
            }
        })
        res.json(imagen);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearImagen = async (req, res) => {
    const { flag_adjunto, id_noticia } = req.body;
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
                url_documento = await guardarArchivo('imagenes', imgFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(imgFile.path);
            }
        }

        // Crear una nueva imagen en la base de datos
        const nuevaImagen = await ImagenNoticia.create({
            url_documento,
            contenido_documento,
            id_noticia,
        });

        // Responder con la nueva imagen creada
        return res.status(201).json({ mensaje: 'Imagen creada con éxito', nuevaImagen });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear imagen', error: error.message });
    }
};


export const actualizarImagen = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la imagen se pasa como un parámetro en la URL
    const { flag_adjunto, id_noticia } = req.body;
    const imgFile = req.file;

    try {
        // Verificar si la imagen con el ID dado existe
        const imagenExistente = await ImagenNoticia.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!imagenExistente) {
            return res.status(404).json({ mensaje: 'Imagen no encontrada' });
        }

        // Validar el tamaño del archivo adjunto si se proporciona uno nuevo
        if (imgFile && imgFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        let url_documento = null;
        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (URL o BIN)
        if (imgFile) {
            if (flag_adjunto === 'URL') {
                url_documento = await guardarArchivo('imagenes', imgFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(imgFile.path);
            }
        }

        // Actualizar la imagen en la base de datos
        const [numRowsUpdated, [imagenActualizada]] = await ImagenNoticia.update(
            {
                url_documento,
                contenido_documento,
                id_noticia,
            },
            {
                where: { id },  // Condición para actualizar el registro con el ID específico
                returning: true,  // Para devolver el registro actualizado
            }
        );

        // Verificar si se actualizó alguna fila
        if (numRowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la imagen para actualizar' });
        }

        // Responder con la imagen actualizada
        return res.status(200).json({ mensaje: 'Imagen actualizada con éxito', imagenActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar imagen', error: error.message });
    }
};


export const eliminarImagen = async (req, res) =>{

    try {
        const { id } = req.params
        await ImagenNoticia.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

const guardarArchivo = async (entidadDir, imgFile) => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const documentosDir = path.join(__dirname, '..', 'documentos', entidadDir);
    const originalFileName = imgFile.originalname;
    const filePath = path.join(documentosDir, originalFileName);
  
    await fs.mkdir(documentosDir, { recursive: true });
    await fs.copyFile(imgFile.path, filePath);
  
    return `${baseUrl}/documentos/${entidadDir}/${originalFileName}`;
  };
  