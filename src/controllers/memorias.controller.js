import { Sequelize } from 'sequelize';
import {Memoria} from '../models/Memorias.js';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; // Para generar un nombre de archivo único

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
        creado_fecha,
    } = req.body;

    const memoriaFile = req.file; // Acceder al archivo cargado

    try {
        const nuevaMemoria = await Memoria.create({
            periodo_memoria,
            descripcion_memoria,
            creado_por,
            creado_fecha,
        });

        if (flag_adjunto === 'URL' && memoriaFile) {
            const uniqueSuffix = uuidv4(); // Generar un nombre de archivo único
            const fileName = `${uniqueSuffix}-${memoriaFile.originalname}`;
            const uploadPath = path.join(__dirname, '/documentos/memorias', fileName); // Ruta de destino del archivo

            // Mueve el archivo a la carpeta de documentos/memorias
            fs.renameSync(memoriaFile.path, uploadPath);

            // Guarda la URL del archivo en la base de datos
            nuevaMemoria.contenido_memoria = null; // Elimina el contenido binario
            nuevaMemoria.url_memoria = `/documentos/memorias/${fileName}`;
        } else if (flag_adjunto === 'BIN' && memoriaFile) {
            nuevaMemoria.contenido_memoria = fs.readFileSync(memoriaFile.path);
        }

        // Elimina el archivo temporal creado por Multer
        fs.unlinkSync(memoriaFile.path);

        await nuevaMemoria.save();
        return res.status(200).json(nuevaMemoria);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
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

    const memoriaFile = req.file; // Acceder al archivo cargado

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

        if (flag_adjunto === 'URL' && memoriaFile) {
            const uniqueSuffix = uuidv4(); // Generar un nombre de archivo único
            const fileName = `${uniqueSuffix}-${memoriaFile.originalname}`;
            const uploadPath = path.join(__dirname, '/documentos/memorias', fileName); // Ruta de destino del archivo

            // Mueve el archivo a la carpeta de documentos/memorias
            fs.renameSync(memoriaFile.path, uploadPath);

            // Guarda la URL del archivo en la base de datos
            memoria.url_memoria = `/documentos/memorias/${fileName}`;
            memoria.contenido_memoria = null; // Elimina el contenido binario
        } else if (flag_adjunto === 'BIN' && memoriaFile) {
            memoria.url_memoria = memoriaFile.originalname; // Almacena el nombre del archivo, si es necesario
            memoria.contenido_memoria = fs.readFileSync(memoriaFile.path);
        }

        // Actualizar el campo BLOB si se proporciona un nuevo archivo
        if (memoriaFile) {
            fs.unlinkSync(memoriaFile.path);
        }

        await memoria.save();
        return res.status(200).json({ mensaje: 'Memoria actualizada con éxito' });
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
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
