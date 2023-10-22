import { Sequelize } from 'sequelize';
import {Directiva} from '../models/Directiva.js';

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
    const { periodo_resolucion, id_area, id_tipo_documento, numero_resolucion, sumilla_resolucion, autorizado } = req.query;
  
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

      whereClause.activo = '1';
  
      const directivas = await Directiva.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
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

import fs from 'fs';

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
        flag_adjunto, // Nuevo campo
    } = req.body;

    const documentoResolucionFile = req.file; // Acceder al archivo cargado

    try {
        const nuevaDirectiva = await Directiva.create({
            periodo_resolucion,
            id_area,
            id_tipo_documento,
            numero_resolucion,
            adicional_resolucion,
            sumilla_resolucion,
            abreviacion_area,
            creado_por,
            creado_fecha
        });


        if (flag_adjunto === 'BIN') {
            nuevaDirectiva.contenido_documento_resolucion = fs.readFileSync(documentoResolucionFile.path);
        } else if (flag_adjunto === 'URL') {
            nuevaDirectiva.url_documento_resolucion = `\\directivas\\${documentoResolucionFile.filename}`;
        }

        // Elimina el archivo temporal creado por Multer
        fs.unlinkSync(documentoResolucionFile.path);

        await nuevaDirectiva.save();

    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
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
         flag_adjunto, // Nuevo campo
    } = req.body;

    const documentoResolucionFile = req.file; // Acceder al archivo cargado

    try {
        const directiva = await Directiva.findByPk(id);

        if (!directiva) {
            return res.status(404).json({ mensaje: 'Directiva no encontrada' });
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

        if (flag_adjunto === 'BIN') {
            if (documentoResolucionFile) {
                directiva.contenido_documento_resolucion = fs.readFileSync(documentoResolucionFile.path);
            }
        } else if (flag_adjunto === 'URL') {
            if (documentoResolucionFile) {
                directiva.url_documento_resolucion = `\\directivas\\${documentoResolucionFile.filename}`;
            }
        }

        // Actualiza el campo BLOB si se proporciona un nuevo archivo
        if (documentoResolucionFile) {
            fs.unlinkSync(documentoResolucionFile.path);
        }

        await directiva.save();
        res.send('Directiva actualizada');
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
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
