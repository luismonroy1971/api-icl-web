import { Sequelize } from 'sequelize';
import {Directiva} from '../models/Directiva.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import dotenv from 'dotenv';
const baseUrl = process.env.BASE_URL; 
import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Directiva.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_resolucion')), 'periodo_resolucion'],
      ],
      order: [[Sequelize.col('periodo_resolucion'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_resolucion'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de resoluciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const leerDirectivas = async (req, res) =>{
    try {
        const directivas = await Directiva.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(directivas);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarDirectivas = async (req, res) => {
    const { periodo_resolucion, id_area, id_tipo_documento, numero_resolucion, sumilla_resolucion, autorizado, codigo_directiva, activo } = req.query;
  
    try {
      const whereClause = {};
  
      if (periodo_resolucion) {
        whereClause.periodo_resolucion = periodo_resolucion;
      }
  
      if (autorizado) {
        whereClause.autorizado = autorizado;
      }
      
      if (id_area) {
        whereClause.id_area = id_area;
      }
  
      if (id_tipo_documento) {
        whereClause.id_tipo_documento = id_tipo_documento;
      }
  
      if (numero_resolucion) {
        whereClause.numero_resolucion = numero_resolucion;
      }
  
      if (sumilla_resolucion) {
        whereClause.sumilla_resolucion = {
          [Sequelize.Op.like]: `%${sumilla_resolucion}%`
        };
      }

     if (codigo_directiva) {
      whereClause.codigo_directiva = {
        [Sequelize.Op.like]: `%${codigo_directiva}%`
      };
    }

      if (activo) {
        whereClause.activo = activo;
      }
  
      const directivas = await Directiva.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_resolucion', 'DESC'],
          ['numero_resolucion', 'DESC'],
          ['id_area', 'DESC']
        ]
      });
  
      res.json(directivas);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerDirectiva = async (req, res) =>{
    const { id } = req.params;
    try {
        const directiva = await Directiva.findOne({
            where:{
                id
            }
        })
        res.json(directiva);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}


export const crearDirectiva = async (req, res) => {
    const {
        periodo_resolucion,
        id_area,
        id_tipo_documento,
        numero_resolucion,
        adicional_resolucion,
        sumilla_resolucion,
        abreviacion_area,
        creado_por,
        creado_fecha,
        flag_adjunto
    } = req.body;

    const pdfFile = req.file;

    try {

        let url_documento = null;
        let contenido_documento = null;

        if (pdfFile && pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        if (flag_adjunto === 'URL' && pdfFile) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'directivas');
            const originalFileName = pdfFile.originalname;
            const filePath = path.join(documentosDir, originalFileName);

            await fs.mkdir(documentosDir, { recursive: true });
            await fs.copyFile(pdfFile.path, filePath);
            url_documento = `${baseUrl}/documentos/directivas/${originalFileName}`;
        } else if (flag_adjunto === 'BIN' && pdfFile) {
            contenido_documento = await fs.readFile(pdfFile.path);
        }

        const nuevaDirectiva = await Directiva.create({
            periodo_resolucion,
            id_area,
            id_tipo_documento,
            numero_resolucion,
            adicional_resolucion,
            sumilla_resolucion,
            abreviacion_area,
            creado_por,
            creado_fecha,
            flag_adjunto,
            url_documento,
            contenido_documento
        });

        return res.status(201).json({ mensaje: 'Directiva creada con éxito', nuevaDirectiva });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear directiva', error: error.message });
    }
};


export const actualizarDirectiva = async (req, res) => {
    const { id } = req.params;
    const {
        periodo_resolucion,
        id_area,
        id_tipo_documento,
        numero_resolucion,
        adicional_resolucion,
        sumilla_resolucion,
        abreviacion_area,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto
    } = req.body;

    const pdfFile = req.file;

    try {
        const directiva = await Directiva.findByPk(id);

        if (!directiva) {
            return res.status(404).json({ mensaje: 'Directiva no encontrada' });
        }

        if (pdfFile && pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        directiva.periodo_resolucion = periodo_resolucion;
        directiva.id_area = id_area;
        directiva.id_tipo_documento = id_tipo_documento;
        directiva.numero_resolucion = numero_resolucion;
        directiva.adicional_resolucion = adicional_resolucion;
        directiva.sumilla_resolucion = sumilla_resolucion;
        directiva.abreviacion_area = abreviacion_area;
        directiva.modificado_por = modificado_por;
        directiva.modificado_fecha = modificado_fecha;
        directiva.activo = activo;

        if (pdfFile) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'directivas');
            const originalFileName = pdfFile.originalname;
            const filePath = path.join(documentosDir, originalFileName);

            if (flag_adjunto === 'URL') {
                await fs.mkdir(documentosDir, { recursive: true });
                await fs.copyFile(pdfFile.path, filePath);
                directiva.url_documento = `${baseUrl}/documentos/directivas/${originalFileName}`;
                directiva.contenido_documento = null;
                directiva.flag_adjunto = 'URL'; 
              } else if (flag_adjunto === 'BIN') {
                directiva.url_documento = null;
                directiva.contenido_documento = await fs.readFile(pdfFile.path);
                directiva.flag_adjunto = 'BIN'; 
              }
        }

        await directiva.save();
        res.status(200).json({ 
          mensaje: 'Directiva actualizada con éxito', 
          directivaActualizada: directiva  // Incluye el objeto actualizado aquí
      });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al modificar directiva', error: error.message });
    }
};



export const autorizarDirectiva = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {
      const directiva = await Directiva.findByPk(id);
      directiva.autorizado = autorizado;
      directiva.autorizado_por = autorizado_por;
      directiva.autorizado_fecha = autorizado_fecha;
      await directiva.save(); 
      res.send('Directiva autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarDirectiva = async (req, res) =>{

    try {
        const { id } = req.params
        await Directiva.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarDirectiva = async (req, res) => {
  try {
    const { id } = req.params; 

    const directiva = await Directiva.findByPk(id);

    if (!directiva) {
      return res.status(404).json({ mensaje: 'Directiva no encontrada' });
    }

    directiva.activo = '1'; // Establecer activo en '1'
    await directiva.save();

    res.json({ mensaje: 'Directiva activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarDirectiva = async (req, res) => {
  try {
    const { id } = req.params; 

    const directiva = await Directiva.findByPk(id);

    if (!directiva) {
      return res.status(404).json({ mensaje: 'Directiva no encontrada' });
    }

    directiva.activo = '0'; // Establecer activo en '0'
    await directiva.save();

    res.json({ mensaje: 'Directiva desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
