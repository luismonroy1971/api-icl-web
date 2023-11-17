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
                contenido_documento = await fs.readFile(pdfFile.path, 'binary');
            }
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevaComunicacion1 = await Comunicacion1.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Comunicación creada con éxito', nuevaComunicacion1 });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear comunicación', error: error.message });
    }
};




export const actualizarComunicacion1 = async (req, res) => {
    const { id } = req.params;
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la comunicacion1 con el ID dado existe
        const comunicacion1Existente = await Comunicacion1.findByPk(id);

        if (!comunicacion1Existente) {
            return res.status(404).json({ mensaje: 'Comunicación no encontrada' });
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
                contenido_documento = await fs.readFile(pdfFile.path, 'binary');
            }
        }

        // Actualizar la comunicacion1 en la base de datos
        const [numRowsUpdated, [comunicacion1Actualizada]] = await Comunicacion1.update(
            {
                url_documento,
                contenido_documento,
                flag_adjunto,
                id_convocatoria
            },
            {
                where: { id },
                returning: true,
            }
        );

        // Verificar si se actualizó alguna fila
        if (numRowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la comunicación para actualizar' });
        }

        // Responder con la comunicacion1 actualizada
        return res.status(200).json({ mensaje: 'Comunicación actualizada con éxito', comunicacion1Actualizada });
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
        return res.status(204).json({ mensaje: 'Comunicación eliminada'});
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