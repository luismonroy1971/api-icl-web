import { Sequelize } from 'sequelize';
import {Rendicion} from '../models/Rendicionescuenta.js';
import path from 'path';
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

import fs from 'fs';

export const crearRendicion = async (req, res) => {
    const {
        descripcion_rendicion,
        periodo_rendicion,
        flag_adjunto,
        creado_por,
        creado_fecha,
    } = req.body;

    const rendicionFile = req.file; // Acceder al archivo cargado

    try {
        const nuevaRendicion = await Rendicion.create({
            descripcion_rendicion,
            periodo_rendicion,
            creado_por,
            creado_fecha,
            flag_adjunto
        });

        if (flag_adjunto === 'BIN' && rendicionFile) {
          const filePath = req.file.path;
          nuevaRendicion.contenido_rendicion = fs.readFileSync(filePath);
          nuevaRendicion.url_rendicion = null; // Establece url_documento_resolucion en null
          fs.unlinkSync(filePath); // Elimina el archivo temporal
        } else if (flag_adjunto === 'URL' && rendicionFile) {
          const fileName = `${req.file.originalname}`;
          const url_rendicion= `${baseUrl}/documentos/rendiciones/${fileName}`;

          // Mueve el archivo a la carpeta documentos/rendiciones
          fs.renameSync(req.file.path, `documentos/rendiciones/${fileName}`);

          nuevaRendicion.url_rendicion = url_rendicion; // Asigna la URL
          nuevaRendicion.contenido_rendicion = null; // Establece el contenido en formato binario en null
        }

        // Elimina el archivo temporal creado por Multer
        if (rendicionFile) {
            fs.unlinkSync(rendicionFile.path);
        }

        await nuevaRendicion.save();
        res.json(nuevaRendicion);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};

export const actualizarRendicion = async (req, res) => {
    const { id } = req.params;
    const {
        descripcion_rendicion,
        periodo_rendicion,
        url_rendicion,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto, // Nuevo campo
    } = req.body;

    const rendicionFile = req.file; // Acceder al archivo cargado

    try {
        const rendicion = await Rendicion.findByPk(id);

        if (!rendicion) {
            return res.status(404).json({ mensaje: 'Rendición no encontrada' });
        }

        rendicion.descripcion_rendicion = descripcion_rendicion;
        rendicion.periodo_rendicion = periodo_rendicion;

        if (flag_adjunto === 'BIN' && rendicionFile) {
          const filePath = req.file.path;
          rendicion.contenido_rendicion = fs.readFileSync(filePath);
          rendicion.url_rendicion = null; // Establece url_documento_resolucion en null
          fs.unlinkSync(filePath); // Elimina el archivo temporal
        } else if (flag_adjunto === 'URL' && rendicionFile) {
          const fileName = `${req.file.originalname}`;
          const url_rendicion= `${baseUrl}/documentos/rendiciones/${fileName}`;

          // Mueve el archivo a la carpeta documentos/rendiciones
          fs.renameSync(req.file.path, `documentos/rendiciones/${fileName}`);

          rendicion.url_rendicion = url_rendicion; // Asigna la URL
          rendicion.contenido_rendicion = null; // Establece el contenido en formato binario en null
        }

        // Actualizar el campo BLOB si se proporciona un nuevo archivo
        if (rendicionFile) {
            fs.unlinkSync(rendicionFile.path);
        }

        rendicion.modificado_por = modificado_por;
        rendicion.modificado_fecha = modificado_fecha;
        rendicion.autorizado = '0';
        rendicion.autorizado_por = null;
        rendicion.autorizado_fecha = null;
        rendicion.activo = activo;

        await rendicion.save();
         res.json({ mensaje: 'Rendición actualizada con éxito' });
    } catch (error) {
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
