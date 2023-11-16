import {Anexo} from '../models/Anexo.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerAnexos = async (req, res) =>{
    try {
        const anexos = await Anexo.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(anexos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerAnexo = async (req, res) =>{
    const { id } = req.params;
    try {
        const anexo = await Anexo.findOne({
            where:{
                id
            }
        })
        res.json(anexo);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearAnexo = async (req, res) => {
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
                url_documento = await guardarArchivo('anexos', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva anexo en la base de datos
        const nuevaAnexo = await Anexo.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva anexo creada
        return res.status(201).json({ mensaje: 'Anexo creado con éxito', nuevaAnexo });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear anexo', error: error.message });
    }
};


export const actualizarAnexo = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la anexo se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la anexo con el ID dado existe
        const anexoExistente = await Anexo.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!anexoExistente) {
            return res.status(404).json({ mensaje: 'Anexo no encontrada' });
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
                url_documento = await guardarArchivo('anexos', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la anexo en la base de datos
        const [numRowsUpdated, [anexoActualizada]] = await Anexo.update(
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
            return res.status(404).json({ mensaje: 'No se encontró la anexo para actualizar' });
        }

        // Responder con la anexo actualizada
        return res.status(200).json({ mensaje: 'Anexo actualizado con éxito', anexoActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar anexo', error: error.message });
    }
};


export const eliminarAnexo = async (req, res) =>{

    try {
        const { id } = req.params
        await Anexo.destroy({
            where:{
                id,
            }
        })
        return res.status(204).json({ mensaje: 'Anexo eliminado'});
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
  
  export const activarAnexo = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const anexo = await Anexo.findByPk(id);
  
      if (!anexo) {
        return res.status(404).json({ mensaje: 'Anexo no encontrado' });
      }
  
      anexo.activo = '1'; // Establecer activo en '1'
      await anexo.save();
  
      res.json({ mensaje: 'Anexo activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarAnexo = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const anexo = await Anexo.findByPk(id);
  
      if (!anexo) {
        return res.status(404).json({ mensaje: 'Anexo no encontrada' });
      }
  
      anexo.activo = '0'; // Establecer activo en '0'
      await anexo.save();
  
      res.json({ mensaje: 'Anexo desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };