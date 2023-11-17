import {Curriculo} from '../models/Curriculo.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerCurriculums = async (req, res) =>{
    try {
        const curriculos = await Curriculo.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(curriculos);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerCurriculo = async (req, res) =>{
    const { id } = req.params;
    try {
        const curriculo = await Curriculo.findOne({
            where:{
                id
            }
        })
        res.json(curriculo);
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
                url_documento = await guardarArchivo('curriculos', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva curriculo en la base de datos
        const nuevaCurriculo = await Curriculo.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva curriculo creada
        return res.status(201).json({ mensaje: 'Curriculo creado con éxito', nuevaCurriculo });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear curriculo', error: error.message });
    }
};


export const actualizarCurriculo = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la curriculo se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la curriculo con el ID dado existe
        const curriculoExistente = await Curriculo.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!curriculoExistente) {
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
                url_documento = await guardarArchivo('curriculos', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la curriculo en la base de datos
        const [numRowsUpdated, [curriculoActualizada]] = await Curriculo.update(
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
            return res.status(404).json({ mensaje: 'No se encontró la curriculo para actualizar' });
        }

        // Responder con la curriculo actualizada
        return res.status(200).json({ mensaje: 'Curriculo actualizado con éxito', curriculoActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar curriculo', error: error.message });
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
        return res.status(204).json({ mensaje: 'Curriculo eliminado'});
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
  
  export const activarCurriculo = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const curriculo = await Curriculo.findByPk(id);
  
      if (!curriculo) {
        return res.status(404).json({ mensaje: 'Curriculo no encontrado' });
      }
  
      curriculo.activo = '1'; // Establecer activo en '1'
      await curriculo.save();
  
      res.json({ mensaje: 'Curriculo activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarCurriculo = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const curriculo = await Curriculo.findByPk(id);
  
      if (!curriculo) {
        return res.status(404).json({ mensaje: 'Curriculo no encontrada' });
      }
  
      curriculo.activo = '0'; // Establecer activo en '0'
      await curriculo.save();
  
      res.json({ mensaje: 'Curriculo desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };