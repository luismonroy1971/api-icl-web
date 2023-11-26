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

        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (BIN)
        if (pdfFile && pdfFile.path) {
            contenido_documento = await fs.readFile(pdfFile.path);
        } else {
            // Manejar el caso en el que no se proporciona ningún archivo
            return res.status(400).json({ mensaje: 'No se proporcionó ningún archivo para subir.' });
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevaComunicacion = await Comunicacion1.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Comunicación creada con éxito', nuevaComunicacion });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear comunicación', error: error.message });
    }
};


export const eliminarComunicacion1 = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL
    try {
        // Busca la comunicación1 en la base de datos por ID
        const comunicacion1 = await Comunicacion1.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!comunicacion1) {
            return res.status(404).json({ mensaje: 'Comunicación no encontrada.' });
        }

        // Realiza la eliminación de la comunicación1 en la base de datos
        await comunicacion1.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Comunicación eliminada con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al eliminar comunicación', error: error.message });
    }
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