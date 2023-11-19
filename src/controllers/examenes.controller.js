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

        let contenido_documento = null;

        // Manejar la lógica según el tipo de adjunto (BIN)
        if (pdfFile && pdfFile.path) {
            contenido_documento = await fs.readFile(pdfFile.path);
        } else {
            // Manejar el caso en el que no se proporciona ningún archivo
            return res.status(400).json({ mensaje: 'No se proporcionó ningún archivo para subir.' });
        }

        // Crear una nueva comunicacion1 en la base de datos
        const nuevoExamen = await Examen.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Examen creado con éxito', nuevoExamen });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear examen', error: error.message });
    }
};


export const eliminarExamen = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL

    try {
        // Busca la comunicación1 en la base de datos por ID
        const examen = await Examen.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!examen) {
            return res.status(404).json({ mensaje: 'Examen no encontrado.' });
        }

        await examen.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Examen eliminado con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al eliminar Examen', error: error.message });
    }
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