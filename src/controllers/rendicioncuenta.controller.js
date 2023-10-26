import { Sequelize } from 'sequelize';
import {Rendicion} from '../models/Rendicionescuenta.js';

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
    const { periodo_rendicion, descripcion_rendicion, autorizado } = req.query;
  
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

      whereClause.activo = '1';
  
      const rendiciones = await Rendicion.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
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
            creado_fecha
        });

        if (flag_adjunto === 'BIN' && rendicionFile) {
            nuevaRendicion.url_rendicion = null; // Establece url_rendicion en null
            nuevaRendicion.contenido_rendicion = fs.readFileSync(rendicionFile.path); // Llena el campo contenido_rendicion con el archivo en binario
        } else if (flag_adjunto === 'URL' && rendicionFile) {
            // Generar un nombre de archivo único
            const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${rendicionFile.originalname}-${uniqueSuffix}`;
            nuevaRendicion.url_rendicion = `\\rendiciones\\${fileName}`;
            nuevaRendicion.contenido_rendicion = null; // Elimina el contenido binario
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
            rendicion.url_rendicion = null; // Establece url_rendicion en null
            rendicion.contenido_rendicion = fs.readFileSync(rendicionFile.path); // Llena el campo contenido_rendicion con el archivo en binario
        } else if (flag_adjunto === 'URL' && rendicionFile) {
            // Generar un nombre de archivo único
            const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${rendicionFile.originalname}-${uniqueSuffix}`;
            rendicion.url_rendicion = `\\rendiciones\\${fileName}`;
            rendicion.contenido_rendicion = null; // Elimina el contenido binario
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
        res.send('Rendición actualizada');
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
