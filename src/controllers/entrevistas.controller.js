import {Entrevista} from '../models/Entrevista.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
const baseUrl = process.env.BASE_URL; 

export const leerEntrevistas = async (req, res) =>{
    try {
        const entrevistas = await Entrevista.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(entrevistas);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerEntrevista = async (req, res) =>{
    const { id } = req.params;
    try {
        const entrevista = await Entrevista.findOne({
            where:{
                id
            }
        })
        res.json(entrevista);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearEntrevista = async (req, res) => {
    
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
        const nuevaEntrevista = await Entrevista.create({
            contenido_documento,
            id_convocatoria,
            flag_adjunto,
        });

        // Responder con la nueva comunicacion1 creada
        return res.status(201).json({ mensaje: 'Entrevista creado con éxito', nuevaEntrevista });
    } catch (error) {
        // Manejar errores y responder con un mensaje de error
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear entrevista', error: error.message });
    }
};


export const eliminarEntrevista = async (req, res) => {
    const { id } = req.params; // Obtén el ID desde los parámetros de la URL

    try {
        // Busca la comunicación1 en la base de datos por ID
        const entrevista = await Entrevista.findByPk(id);

        // Verifica si la comunicación1 existe
        if (!entrevista) {
            return res.status(404).json({ mensaje: 'Entrevista no encontrado.' });
        }

        await entrevista.destroy();

        // Responde con un mensaje de éxito
        return res.status(200).json({ mensaje: 'Entrevista eliminado con éxito.' });
    } catch (error) {
        // Maneja errores y responde con un mensaje de error
        return res.status(500).json({ mensaje: 'Error al eliminar Entrevista', error: error.message });
    }
};
  
  export const activarEntrevista = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const entrevista = await Entrevista.findByPk(id);
  
      if (!entrevista) {
        return res.status(404).json({ mensaje: 'Entrevista no encontrado' });
      }
  
      entrevista.activo = '1'; // Establecer activo en '1'
      await entrevista.save();
  
      res.json({ mensaje: 'Entrevista activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  
  
  export const desactivarEntrevista = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const entrevista = await Entrevista.findByPk(id);
  
      if (!entrevista) {
        return res.status(404).json({ mensaje: 'Entrevista no encontrada' });
      }
  
      entrevista.activo = '0'; // Establecer activo en '0'
      await entrevista.save();
  
      res.json({ mensaje: 'Entrevista desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };