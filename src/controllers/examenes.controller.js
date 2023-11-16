import {Examen} from '../models/Examen.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerExamenes = async (req, res) =>{
    try {
        const examenes = await Examen.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(examenes);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerExamen = async (req, res) =>{
    const { id } = req.params;
    try {
        const examen = await Examen.findOne({
            where:{
                id
            }
        })
        res.json(examen);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearExamen = async (req, res) => {
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
                url_documento = await guardarArchivo('examenes', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Crear una nueva examen en la base de datos
        const nuevaExamen = await Examen.create({
            url_documento,
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva examen creada
        return res.status(201).json({ mensaje: 'Examen creado con éxito', nuevaExamen });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear examen', error: error.message });
    }
};


export const actualizarExamen = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la examen se pasa como un parámetro en la URL
    const { flag_adjunto, id_convocatoria } = req.body;
    const pdfFile = req.file;

    try {
        // Verificar si la examen con el ID dado existe
        const examenExistente = await Examen.findByPk(id);  // Utiliza findByPk para buscar por clave primaria en Sequelize

        if (!examenExistente) {
            return res.status(404).json({ mensaje: 'Examen no encontrada' });
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
                url_documento = await guardarArchivo('examenes', pdfFile);
            } else if (flag_adjunto === 'BIN') {
                contenido_documento = await fs.readFile(pdfFile.path);
            }
        }

        // Actualizar la examen en la base de datos
        const [numRowsUpdated, [examenActualizada]] = await Examen.update(
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
            return res.status(404).json({ mensaje: 'No se encontró la examen para actualizar' });
        }

        // Responder con la examen actualizada
        return res.status(200).json({ mensaje: 'Examen actualizado con éxito', examenActualizada });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar examen', error: error.message });
    }
};


export const eliminarExamen = async (req, res) =>{

    try {
        const { id } = req.params
        await Examen.destroy({
            where:{
                id,
            }
        })
        return res.status(204).json({ mensaje: 'Examen eliminado'});
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
  
  export const activarExamen = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const examen = await Examen.findByPk(id);
  
      if (!examen) {
        return res.status(404).json({ mensaje: 'Examen no encontrado' });
      }
  
      examen.activo = '1'; // Establecer activo en '1'
      await examen.save();
  
      res.json({ mensaje: 'Examen activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarExamen = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const examen = await Examen.findByPk(id);
  
      if (!examen) {
        return res.status(404).json({ mensaje: 'Examen no encontrada' });
      }
  
      examen.activo = '0'; // Establecer activo en '0'
      await examen.save();
  
      res.json({ mensaje: 'Examen desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };