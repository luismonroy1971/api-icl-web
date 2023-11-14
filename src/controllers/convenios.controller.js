import { Sequelize } from 'sequelize';
import {Convenio} from '../models/Convenio.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

import dotenv from 'dotenv';
const baseUrl = process.env.BASE_URL; 
import slugify from 'slugify';

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Convenio.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_convenio')), 'periodo_convenio'],
      ],
      order: [[Sequelize.col('periodo_convenio'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_convenio'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de convenios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const leerConvenios = async (req, res) =>{
    try {
        const convenios = await Convenio.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(convenios);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarConvenios = async (req, res) => {
  const { descripcion_convenio, periodo_convenio, periodo_mes, id_departamento, id_provincia, id_distrito, autorizado, activo } = req.query;

  try {
    const whereClause = {};

    if (descripcion_convenio) {
      whereClause.descripcion_convenio = {
        [Sequelize.Op.like]: `%${descripcion_convenio}%`
      };
    }

    if (autorizado) {
      whereClause.autorizado = autorizado;
    }

    if (periodo_convenio) {
      whereClause.periodo_convenio = periodo_convenio;
    }

    if (periodo_mes) {
      whereClause.periodo_mes = periodo_mes;
    }

    if (id_departamento) {
      whereClause.id_departamento = id_departamento;
    }

    if (id_provincia) {
      whereClause.id_provincia = id_provincia;
    }

    if (id_distrito) {
      whereClause.id_distrito = id_distrito;
    }

    const convenios = await Convenio.findAll({
      where: whereClause,
      order: [['fecha_convenio', 'DESC']], 
    });

    // Transformar los resultados para cambiar el orden de los campos
    const resultadoTransformado = convenios.map(convenio => ({
      id: convenio.id,
      descripcion_convenio: convenio.descripcion_convenio,
      flag_adjunto: convenio.flag_adjunto,
      id_departamento: convenio.id_departamento,
      id_provincia: convenio.id_provincia,
      id_distrito: convenio.id_distrito,
      url_documento_convenio: convenio.url_documento_convenio,
      contenido_documento_convenio: convenio.contenido_documento_convenio,
      fecha_convenio: convenio.fecha_convenio,
      periodo_convenio: convenio.periodo_convenio,
      periodo_mes: convenio.periodo_mes,
      creado_por: convenio.creado_por,
      creado_fecha: convenio.creado_fecha,
      modificado_por: convenio.modificado_por,
      modificado_fecha: convenio.modificado_fecha,
      autorizado: convenio.autorizado,
      autorizado_por: convenio.autorizado_por,
      autorizado_fecha: convenio.autorizado_fecha,
      activo: convenio.activo,
    }));

    res.json(resultadoTransformado);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

  

export const leerConvenio = async (req, res) =>{
    const { id } = req.params;
    try {
        const convenio = await Convenio.findOne({
            where:{
                id
            }
        })
        res.json(convenio);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}


export const crearConvenio = async (req, res) => {
    const {
        descripcion_convenio,
        fecha_convenio,
        creado_por,
        creado_fecha,
        id_departamento,
        id_provincia,
        id_distrito,
        flag_adjunto
    } = req.body;
    const pdfFile = req.file;

    try {
        if (!pdfFile || pdfFile.size > 10000000) {
            return res.status(400).json({ message: 'Archivo no proporcionado o demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'convenios');
        const originalFileName = pdfFile.originalname;
        const filePath = path.join(documentosDir, originalFileName);

        let url_documento_convenio = null;
        let contenido_documento_convenio = null;

        if (flag_adjunto === 'URL') {
            await fs.mkdir(documentosDir, { recursive: true });
            await fs.copyFile(pdfFile.path, filePath);
            url_documento_convenio = `${baseUrl}/documentos/convenios/${originalFileName}`; // baseUrl debe ser la URL base de tu servidor web
        } else if (flag_adjunto === 'BIN') {
            contenido_documento_convenio = await fs.readFile(pdfFile.path);
        }

        const nuevoConvenio = await Convenio.create({
            descripcion_convenio,
            fecha_convenio,
            creado_por,
            creado_fecha,
            id_departamento,
            id_provincia,
            id_distrito,
            flag_adjunto,
            url_documento_convenio,
            contenido_documento_convenio
        });

        res.status(201).json(nuevoConvenio);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear convenio', error: error.message });
    }
};


export const actualizarConvenio = async (req, res) => {
    const { id } = req.params;
    const {
        descripcion_convenio,
        fecha_convenio,
        id_departamento,
        id_provincia,
        id_distrito,
        modificado_por,
        modificado_fecha,
        activo,
        flag_adjunto
    } = req.body;

    const pdfFile = req.file;

    try {
        const convenio = await Convenio.findByPk(id);

        if (!convenio) {
            return res.status(404).json({ message: 'Convenio no encontrado' });
        }

        if (pdfFile && pdfFile.size > 10000000) { // 10 MB en bytes
            return res.status(400).json({ message: 'El archivo es demasiado grande. El tamaño máximo permitido es de 10 MB.' });
        }

        convenio.descripcion_convenio = descripcion_convenio;
        convenio.fecha_convenio = fecha_convenio;
        convenio.id_departamento = id_departamento;
        convenio.id_provincia = id_provincia;
        convenio.id_distrito = id_distrito;
        convenio.modificado_por = modificado_por;
        convenio.modificado_fecha = modificado_fecha;
        convenio.activo = activo;

        if (pdfFile) {
            const __dirname = path.dirname(fileURLToPath(import.meta.url));
            const documentosDir = path.join(__dirname, '..', 'public', 'documentos', 'convenios');
            const originalFileName = pdfFile.originalname;
            const filePath = path.join(documentosDir, originalFileName);

            if (flag_adjunto === 'URL') {
                await fs.mkdir(documentosDir, { recursive: true });
                await fs.copyFile(pdfFile.path, filePath);
                convenio.url_documento_convenio = `${baseUrl}/documentos/convenios/${originalFileName}`;
                convenio.contenido_documento_convenio = null;
            } else if (flag_adjunto === 'BIN') {
                convenio.url_documento_convenio = null;
                convenio.contenido_documento_convenio = await fs.readFile(pdfFile.path);
            }
        }

        await convenio.save();
        res.status(200).json({ message: 'Convenio actualizado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al modificar convenio', error: error.message });
    }
};



export const autorizarConvenio = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try{
  const convenio = await Convenio.findByPk(id);
  
  convenio.autorizado = autorizado;
  convenio.autorizado_por = autorizado_por;
  convenio.autorizado_fecha = autorizado_fecha;
  await convenio.save(); 
  res.send('Convenio autorizado/desautorizado');
  }
  catch(error){
       return res.status(500).json({ mensaje: error.message })
  }
}


export const eliminarConvenio = async (req, res) => {
    try {
        const { id } = req.params;
        await Convenio.destroy({
            where: {
                id,
            },
        });
        res.status(204).json({ mensaje: 'Convenio eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};


export const activarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convenio = await Convenio.findByPk(id);
  
      if (!convenio) {
        return res.status(404).json({ mensaje: 'Convenio no encontrada' });
      }
  
      convenio.activo = '1'; // Establecer activo en '1'
      await convenio.save();
  
      res.json({ mensaje: 'Convenio activado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvenio = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convenio = await Convenio.findByPk(id);
  
      if (!convenio) {
        return res.status(404).json({ mensaje: 'Convenio no encontrado' });
      }
  
      convenio.activo = '0'; // Establecer activo en '0'
      await convenio.save();
  
      res.json({ mensaje: 'Convenio desactivado correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };