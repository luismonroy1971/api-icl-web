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

        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (BIN)
        if (pdfFile && pdfFile.path) {
            contenido_documento = await fs.readFile(pdfFile.path);
        } else {
            // Manejar el caso en el que no se proporciona ningún archivo
            return res.status(400).json({ mensaje: 'No se proporcionó ningún archivo para subir.' });
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevoCurriculo = await Curriculo.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Curriculo creado con éxito', nuevoCurriculo });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear curriculo', error: error.message });
    }
};


export const eliminarCurriculo = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL

    try {
        // Busca la comunicación1 en la base de datos por ID
        const curriculo = await Curriculo.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!curriculo) {
            return res.status(404).json({ mensaje: 'Curriculo no encontrado.' });
        }

        await curriculo.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Curriculo eliminado con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al eliminar Curriculo', error: error.message });
    }
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