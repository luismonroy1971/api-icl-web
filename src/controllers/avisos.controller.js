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
                contenido_documento = await fs.readFile(pdfFile.path, 'binary');
            }
        }

        // Crear una nueva Aviso en la base de datos
        const nuevaaviso = await Aviso.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva Aviso creada
        return res.status(201).json({ mensaje: 'Aviso creada con éxito', nuevaaviso });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear Aviso', error: error.message });
    }
};




export const actualizarAviso = async (req, res) => {
    const { id } = req.params;
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la Aviso con el ID dado existe
        const AvisoExistente = await Aviso.findByPk(id);

        if (!AvisoExistente) {
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
                contenido_documento = await fs.readFile(pdfFile.path, 'binary');
            }
        }

        // Actualizar la Aviso en la base de datos
        const [numRowsUpdated, [AvisoActualizada]] = await Aviso.update(
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
            return res.status(404).json({ mensaje: 'No se encontró el aviso para actualizar' });
        }

        // Responder con la Aviso actualizada
        return res.status(200).json({ mensaje: 'Aviso actualizado con éxito', AvisoActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar Aviso', error: error.message });
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
        return res.status(204).json({ mensaje: 'Aviso eliminado'});
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
  
  export const activarAviso = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const aviso = await Aviso.findByPk(id);
  
      if (!aviso) {
        return res.status(404).json({ mensaje: 'Aviso no encontrado' });
      }
  
      aviso.activo = '1'; // Establecer activo en '1'
      await aviso.save();
  
      res.json({ mensaje: 'Aviso activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarAviso = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const aviso = await Aviso.findByPk(id);
  
      if (!aviso) {
        return res.status(404).json({ mensaje: 'Aviso no encontrada' });
      }
  
      aviso.activo = '0'; // Establecer activo en '0'
      await aviso.save();
  
      res.json({ mensaje: 'Aviso desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };