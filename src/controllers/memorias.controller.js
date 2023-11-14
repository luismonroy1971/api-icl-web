import { Sequelize } from 'sequelize';
import {Memoria} from '../models/Memorias.js';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único
import dotenv from 'dotenv';
const baseUrl = process.env.BASE_URL; 

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Memoria.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_memoria')), 'periodo_memoria'],
      ],
      order: [[Sequelize.col('periodo_memoria'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_memoria'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de memorias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const leerMemorias = async (req, res) =>{
    try {
        const memorias = await Memoria.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(memorias);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarMemorias = async (req, res) => {
    const { periodo_memoria, descripcion_memoria, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (periodo_memoria) {
        whereClause.periodo_memoria = periodo_memoria;
      }

      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (descripcion_memoria) {
        whereClause.descripcion_memoria = {
          [Sequelize.Op.like]: `%${descripcion_memoria}%`
        };
      }
  
      if (activo) {
        whereClause.activo = activo;
      }
      
      const memorias = await Memoria.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,order: [
          ['periodo_memoria', 'DESC'],
        ]
      });
  
      res.json(memorias);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerMemoria = async (req, res) =>{
    const { id } = req.params;
    try {
        const memoria = await Memoria.findOne({
            where:{
                id
            }
        })
        res.json(memoria);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}


export const crearMemoria = async (req, res) => {
    const {
        periodo_memoria,
        descripcion_memoria,
        flag_adjunto,
        creado_por,
        creado_fecha
    } = req.body;

    const pdfFile = req.file;

    try {
        if (!pdfFile) {
            return res.status(400).json({ mensaje: 'No se ha proporcionado un archivo PDF' });
        }

        if (pdfFile.size > 10000000) { // 10 MB en bytes
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        if (!pdfFile.mimetype.includes("pdf")) {
            return res.status(400).json({ message: 'Tipo de archivo no permitido. Solo se aceptan archivos PDF.' });
        }

        if (flag_adjunto !== 'URL' && flag_adjunto !== 'BIN') {
            return res.status(400).json({ mensaje: 'El valor de flag_adjunto no es válido' });
        }

        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'memorias');
        const fileNameParts = pdfFile.originalname.split('.');
        const fileExtension = fileNameParts.pop();
        const baseFileName = fileNameParts.join('.');
        const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
        const filePath = path.join(documentosDir, safeFileName);

        let url_documento = null;
        let contenido_documento = null;

        if (flag_adjunto === 'URL') {
            await fs.mkdir(documentosDir, { recursive: true });
            await fs.copyFile(pdfFile.path, filePath);
            url_documento = `${baseUrl}/documentos/memorias/${safeFileName}`;
        } else if (flag_adjunto === 'BIN') {
            contenido_documento = await fs.readFile(pdfFile.path);
        }

        const nuevaMemoria = await Memoria.create({
            periodo_memoria,
            descripcion_memoria,
            creado_por,
            creado_fecha,
            flag_adjunto,
            url_documento,
            contenido_documento
        });

        return res.status(201).json({ mensaje: 'Memoria creada con éxito', nuevaMemoria });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear memoria', error: error.message });
    }
};


export const actualizarMemoria = async (req, res) => {
    const { id } = req.params;
    const {
        periodo_memoria,
        descripcion_memoria,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto
    } = req.body;

    const pdfFile = req.file;

    try {
        const memoria = await Memoria.findByPk(id);

        if (!memoria) {
            return res.status(404).json({ mensaje: 'Memoria no encontrada' });
        }

        if (pdfFile && pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        memoria.periodo_memoria = periodo_memoria;
        memoria.descripcion_memoria = descripcion_memoria;
        memoria.modificado_por = modificado_por;
        memoria.modificado_fecha = modificado_fecha;
        memoria.activo = activo;

        if (pdfFile) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'memorias');
            const fileNameParts = pdfFile.originalname.split('.');
            const fileExtension = fileNameParts.pop();
            const baseFileName = fileNameParts.join('.');
            const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
            const filePath = path.join(documentosDir, safeFileName);

            if (flag_adjunto === 'URL') {
                await fs.mkdir(documentosDir, { recursive: true });
                await fs.copyFile(pdfFile.path, filePath);
                memoria.url_documento = `${baseUrl}/documentos/memorias/${safeFileName}`;
                memoria.contenido_documento = null;
                memoria.flag_adjunto = 'URL';
            } else if (flag_adjunto === 'BIN') {
                memoria.url_documento = null;
                memoria.contenido_documento = await fs.readFile(pdfFile.path);
                memoria.flag_adjunto = 'BIN';
            }
        }

        await memoria.save();
        res.status(200).json({ 
          mensaje: 'Memoria actualizada con éxito', 
          memoriaActualizada: memoria  // Incluye el objeto actualizado aquí
      });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al modificar memoria', error: error.message });
    }
};


export const autorizarMemoria = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha} = req.body;

  try {
      const memoria = await Memoria.findByPk(id);
      memoria.autorizado = autorizado;
      memoria.autorizado_por = autorizado_por;
      memoria.autorizado_fecha = autorizado_fecha;
      await memoria.save(); 
      res.send('Memoria autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarMemoria = async (req, res) =>{

    try {
        const { id } = req.params
        await Memoria.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarMemoria = async (req, res) => {
  try {
    const { id } = req.params; 

    const memoria = await Memoria.findByPk(id);

    if (!memoria) {
      return res.status(404).json({ mensaje: 'Memoria no encontrada' });
    }

    memoria.activo = '1'; // Establecer activo en '1'
    await memoria.save();

    res.json({ mensaje: 'Memoria activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarMemoria = async (req, res) => {
  try {
    const { id } = req.params; 

    const memoria = await Memoria.findByPk(id);

    if (!memoria) {
      return res.status(404).json({ mensaje: 'Memoria no encontrada' });
    }

    memoria.activo = '0'; // Establecer activo en '0'
    await memoria.save();

    res.json({ mensaje: 'Memoria desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
