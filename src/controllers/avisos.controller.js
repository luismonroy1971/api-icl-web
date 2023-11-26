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

        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (BIN)
        if (pdfFile && pdfFile.path) {
            contenido_documento = await fs.readFile(pdfFile.path);
        } else {
            // Manejar el caso en el que no se proporciona ningún archivo
            return res.status(400).json({ mensaje: 'No se proporcionó ningún archivo para subir.' });
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevoAviso = await Aviso.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Aviso creado con éxito', nuevoAviso });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al crear aviso', error: error.message });
    }
};


export const eliminarAviso = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL

    try {
        // Busca la comunicación1 en la base de datos por ID
        const aviso = await Aviso.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!aviso) {
            return res.status(404).json({ mensaje: 'Aviso no encontrado.' });
        }

        await aviso.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Aviso eliminado con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al eliminar Aviso', error: error.message });
    }
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