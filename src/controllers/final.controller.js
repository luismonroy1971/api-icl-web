import {Final} from '../models/Final.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerFinales = async (req, res) =>{
    try {
        const finales = await Final.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(finales);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerFinal = async (req, res) =>{
    const { id } = req.params;
    try {
        const final = await Final.findOne({
            where:{
                id
            }
        })
        res.json(final);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearFinal = async (req, res) => {
    
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
        const nuevoFinal = await Final.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Resultado Final creado con éxito', nuevoFinal });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear Resultado final', error: error.message });
    }
};


export const eliminarFinal = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL

    try {
        // Busca la comunicación1 en la base de datos por ID
        const final = await Final.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!final) {
            return res.status(404).json({ mensaje: 'Resultado Final no encontrado.' });
        }

        await final.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Resultado Final eliminado con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al eliminar Final', error: error.message });
    }
};
  export const activarFinal = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const final = await Final.findByPk(id);
  
      if (!final) {
        return res.status(404).json({ mensaje: 'Resultado Final no encontrado' });
      }
  
      final.activo = '1'; // Establecer activo en '1'
      await final.save();
  
      res.json({ mensaje: 'Resultado Final activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarFinal = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const final = await Final.findByPk(id);
  
      if (!final) {
        return res.status(404).json({ mensaje: 'Resultado Final no encontrada' });
      }
  
      final.activo = '0'; // Establecer activo en '0'
      await final.save();
  
      res.json({ mensaje: 'Resultado Final desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };