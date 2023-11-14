import { Sequelize } from 'sequelize';
import {Rendicion} from '../models/Rendicionescuenta.js';
import fs from 'fs/promises';
import path from 'path';
import slugify from 'slugify';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único
import dotenv from 'dotenv';
const baseUrl = process.env.BASE_URL; 

export const obtenerPeriodos = async (req, res) => {
    try {
      const aniosUnicos = await Rendicion.findAll({
        attributes: [
          [Sequelize.fn('DISTINCT', Sequelize.col('periodo_rendicion')), 'periodo_rendicion'],
        ],
        order: [[Sequelize.col('periodo_rendicion'), 'DESC']],
      });
  
      // Extraer los valores de aniosUnicos
      const anios = aniosUnicos.map((anio) => anio.get('periodo_rendicion'));
  
      res.json(anios);
    } catch (error) {
      console.error('Error al obtener años únicos de rendiciones:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

export const leerRendiciones = async (req, res) =>{
    try {
        const rendiciones = await Rendicion.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(rendiciones);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarRendiciones = async (req, res) => {
    const { periodo_rendicion, descripcion_rendicion, autorizado, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (periodo_rendicion) {
        whereClause.periodo_rendicion = periodo_rendicion;
      }
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }

      if (descripcion_rendicion) {
        whereClause.descripcion_rendicion = {
          [Sequelize.Op.like]: `%${descripcion_rendicion}%`
        };
      }

      if (activo) {
        whereClause.activo = activo;
      }
  
      const rendiciones = await Rendicion.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_rendicion', 'DESC']
        ]
      });
  
      res.json(rendiciones);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerRendicion = async (req, res) =>{
    const { id } = req.params;
    try {
        const rendicion = await Rendicion.findOne({
            where:{
                id
            }
        })
        res.json(rendicion);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const crearRendicion = async (req, res) => {
    const {
        descripcion_rendicion,
        periodo_rendicion,
        flag_adjunto,
        creado_por,
        creado_fecha,
    } = req.body;

    const rendicionFile = req.file;

    try {
        const nuevaRendicion = await Rendicion.create({
            descripcion_rendicion,
            periodo_rendicion,
            creado_por,
            creado_fecha,
            flag_adjunto
        });

        if (rendicionFile) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'rendiciones');
            const fileNameParts = rendicionFile.originalname.split('.');
            const fileExtension = fileNameParts.pop();
            const baseFileName = fileNameParts.join('.');
            const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
            const filePath = path.join(documentosDir, safeFileName);

            if (flag_adjunto === 'URL') {
                await fs.mkdir(documentosDir, { recursive: true });
                await fs.copyFile(rendicionFile.path, filePath);
                nuevaRendicion.url_rendicion = `${baseUrl}/documentos/rendiciones/${safeFileName}`;
                nuevaRendicion.contenido_rendicion = null;
            } else if (flag_adjunto === 'BIN') {
                nuevaRendicion.url_rendicion = null;
                nuevaRendicion.contenido_rendicion = await fs.readFile(rendicionFile.path);
            }
        }

        await nuevaRendicion.save();
        res.json(nuevaRendicion);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: error.message });
    }
};


export const actualizarRendicion = async (req, res) => {
    const { id } = req.params;
    const {
        descripcion_rendicion,
        periodo_rendicion,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto
    } = req.body;

    const rendicionFile = req.file;

    try {
        const rendicion = await Rendicion.findByPk(id);

        if (!rendicion) {
            return res.status(404).json({ mensaje: 'Rendición no encontrada' });
        }

        if (rendicionFile && rendicionFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        rendicion.descripcion_rendicion = descripcion_rendicion;
        rendicion.periodo_rendicion = periodo_rendicion;
        rendicion.modificado_por = modificado_por;
        rendicion.modificado_fecha = modificado_fecha;
        rendicion.activo = activo;

        if (rendicionFile) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'rendiciones');
            const fileNameParts = rendicionFile.originalname.split('.');
            const fileExtension = fileNameParts.pop();
            const baseFileName = fileNameParts.join('.');
            const safeFileName = `${slugify(baseFileName, { lower: true, strict: true })}.${fileExtension}`;
            const filePath = path.join(documentosDir, safeFileName);

            if (flag_adjunto === 'URL') {
                await fs.mkdir(documentosDir, { recursive: true });
                await fs.copyFile(rendicionFile.path, filePath);
                rendicion.url_rendicion = `${baseUrl}/documentos/rendiciones/${safeFileName}`;
                rendicion.contenido_rendicion = null;
                rendicion.flag_adjunto = 'URL';
            } else if (flag_adjunto === 'BIN') {
                rendicion.url_rendicion = null;
                rendicion.contenido_rendicion = await fs.readFile(rendicionFile.path);
                rendicion.flag_adjunto = 'BIN';
              }
        }

        await rendicion.save();
        res.status(200).json({ 
          mensaje: 'Rendición actualizada con éxito', 
          rendicionActualizada: rendicion  // Incluye el objeto actualizado aquí
      });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: error.message });
    }
};


export const autorizarRendicion = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const rendicion = await Rendicion.findByPk(id);
  rendicion.autorizado = autorizado;
  rendicion.autorizado_por = autorizado_por;
  rendicion.autorizado_fecha = autorizado_fecha;
  await rendicion.save(); 
  res.send('Rendición autorizada / desautorizada');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarRendicion = async (req, res) =>{

    try {
        const { id } = req.params
        await Rendicion.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarRendicion = async (req, res) => {
  try {
    const { id } = req.params; 

    const rendicion = await Rendicion.findByPk(id);

    if (!rendicion) {
      return res.status(404).json({ mensaje: 'Rendicion no encontrada' });
    }

    rendicion.activo = '1'; // Establecer activo en '1'
    await rendicion.save();

    res.json({ mensaje: 'Rendicion activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarRendicion = async (req, res) => {
  try {
    const { id } = req.params; 

    const rendicion = await Rendicion.findByPk(id);

    if (!rendicion) {
      return res.status(404).json({ mensaje: 'Rendicion no encontrada' });
    }

    rendicion.activo = '0'; // Establecer activo en '0'
    await rendicion.save();

    res.json({ mensaje: 'Rendicion desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
