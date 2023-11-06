import { Sequelize } from 'sequelize';
import {Memoria} from '../models/Memorias.js';
import fs from 'fs';
import slugify from 'slugify';
import path from 'path';
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

        if (flag_adjunto !== 'URL' && flag_adjunto !== 'BIN') {
            return res.status(400).json({ mensaje: 'El valor de flag_adjunto no es válido' });
        }

        const nuevaMemoria = await Memoria.create({
            periodo_memoria,
            descripcion_memoria,
            creado_por,
            creado_fecha,
            flag_adjunto
        });

        if (flag_adjunto === 'URL') {
            const originalFileName = req.file.originalname;
            const fileNameWithoutExtension = originalFileName.split('.').slice(0, -1).join('.'); // Elimina la extensión del archivo
            const safeFileName = slugify(fileNameWithoutExtension, { lower: true }); // Convierte el nombre a una versión segura

            const fileExtension = originalFileName.split('.').pop(); // Obtiene la extensión del archivo
            const fileName = `${safeFileName}.${fileExtension}`;
            const url_memoria = `${baseUrl}/documentos/memorias/${fileName}`;

            // Mueve el archivo a la carpeta documentos/memorias
            fs.renameSync(req.file.path, `documentos/memorias/${fileName}`);

            nuevaMemoria.url_memoria = url_memoria; // Asigna la URL
            nuevaMemoria.contenido_memoria = null; // Establece el contenido en formato binario en null
        } else if (flag_adjunto === 'BIN') {
            const filePath = req.file.path;
            nuevaMemoria.contenido_memoria = fs.readFileSync(filePath);
            nuevaMemoria.url_memoria = null; // Establece url_documento_resolucion en null
            fs.unlinkSync(filePath); // Elimina el archivo temporal
        }
        await nuevaMemoria.save();

        return res.status(200).json(nuevaMemoria);
    } catch (error) {
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
        flag_adjunto, // Nuevo campo
    } = req.body;

    const pdfFile = req.file; // Acceder al archivo cargado

    try {
        const memoria = await Memoria.findByPk(id);

        if (!memoria) {
            return res.status(404).json({ mensaje: 'Memoria no encontrada' });
        }

        memoria.periodo_memoria = periodo_memoria;
        memoria.descripcion_memoria = descripcion_memoria;
        memoria.modificado_por = modificado_por;
        memoria.modificado_fecha = modificado_fecha;
        memoria.autorizado = '0';
        memoria.autorizado_por = null;
        memoria.autorizado_fecha = null;
        memoria.activo = activo;

        if (flag_adjunto === 'URL' && pdfFile) {
          const fileName = `${req.file.originalname}`;
          const url_memoria= `${baseUrl}/documentos/memorias/${fileName}`;

          // Mueve el archivo a la carpeta documentos/memoriaes
          fs.renameSync(req.file.path, `documentos/memorias/${fileName}`);

          memoria.url_memoria = url_memoria; // Asigna la URL
          memoria.contenido_memoria = null; // Establece el contenido en formato binario en null
        } else if (flag_adjunto === 'BIN' && pdfFile) {
          const filePath = req.file.path;
          memoria.contenido_memoria = fs.readFileSync(filePath);
          memoria.url_memoria = null; // Establece url_documento_resolucion en null
          fs.unlinkSync(filePath); // Elimina el archivo temporal
        }

        // Actualizar el campo BLOB si se proporciona un nuevo archivo
        if (pdfFile) {
            fs.unlinkSync(pdfFile.path);
        }

        await memoria.save();
        return res.status(200).json({ mensaje: 'Memoria actualizada con éxito' });
    } catch (error) {
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
