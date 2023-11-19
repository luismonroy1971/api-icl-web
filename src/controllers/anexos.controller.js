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

        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (BIN)
        if (pdfFile && pdfFile.path) {
            contenido_documento = await fs.readFile(pdfFile.path);
        } else {
            // Manejar el caso en el que no se proporciona ningún archivo
            return res.status(400).json({ mensaje: 'No se proporcionó ningún archivo para subir.' });
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevoAnexo = await Anexo.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Anexo creado con éxito', nuevoAnexo });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear anexo', error: error.message });
    }
};


export const eliminarAnexo = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL

    try {
        // Busca la comunicación1 en la base de datos por ID
        const anexo = await Anexo.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!anexo) {
            return res.status(404).json({ mensaje: 'Anexo no encontrado.' });
        }

        await anexo.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Anexo eliminado con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al eliminar Anexo', error: error.message });
    }
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
  
      res.json({ mensaje: 'Anexo activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarAnexo = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const anexo = await Anexo.findByPk(id);
  
      if (!anexo) {
        return res.status(404).json({ mensaje: 'Anexo no encontrado' });
      }
  
      anexo.activo = '0'; // Establecer activo en '0'
      await anexo.save();
  
      res.json({ mensaje: 'Anexo desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };