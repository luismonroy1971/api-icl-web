import { Sequelize } from 'sequelize';
import {Resolucion} from '../models/Resolucion.js';

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Resolucion.findAll({
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

export const leerResoluciones = async (req, res) =>{
    try {
        const resoluciones = await Resolucion.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(resoluciones);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarResoluciones = async (req, res) => {
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
      
      const resoluciones = await Resolucion.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [
          ['periodo_resolucion', 'ASC'],
          ['id_area', 'ASC'],
          ['numero_resolucion', 'ASC']
        ]
      });
  
      res.json(resoluciones);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerResolucion = async (req, res) =>{
    const { id } = req.params;
    try {
        const resolucion = await Resolucion.findOne({
            where:{
                id
            }
        })
        res.json(resolucion);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearResolucion = async (req, res) => {
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

    try {
        const nuevaResolucion = await Resolucion.create({
            periodo_resolucion,
            id_area,
            id_tipo_documento,
            numero_resolucion,
            adicional_resolucion,
            sumilla_resolucion,
            abreviacion_area,
            creado_por,
            creado_fecha,
        });

        if (flag_adjunto === 'BIN') {
            nuevaResolucion.contenido_documento_resolucion = req.file.buffer; // Usa req.file.buffer para obtener el contenido en formato binario
            nuevaResolucion.url_documento_resolucion = null; // Establece url_documento_resolucion en null
        } else if (flag_adjunto === 'URL') {
            const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${req.file.originalname}-${uniqueSuffix}`;
            nuevaResolucion.url_documento_resolucion = `\\resoluciones\\${fileName}`;
            nuevaResolucion.contenido_documento_resolucion = null; // Establece el contenido en formato binario en null
        }

        await nuevaResolucion.save();

        res.json(nuevaResolucion);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
};


export const actualizarResolucion = async (req, res) => {
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

    try {
        const resolucion = await Resolucion.findByPk(id);
        if (!resolucion) {
            return res.status(404).json({ mensaje: 'Resolución no encontrada' });
        }

        resolucion.periodo_resolucion = periodo_resolucion;
        resolucion.id_area = id_area;
        resolucion.id_tipo_documento = id_tipo_documento;
        resolucion.numero_resolucion = numero_resolucion;
        resolucion.adicional_resolucion = adicional_resolucion;
        resolucion.sumilla_resolucion = sumilla_resolucion;
        resolucion.abreviacion_area = abreviacion_area;
        resolucion.modificado_por = modificado_por;
        resolucion.modificado_fecha = modificado_fecha;
        resolucion.autorizado = '0';
        resolucion.autorizado_por = null;
        resolucion.autorizado_fecha = null;
        resolucion.activo = activo;

        if (flag_adjunto === 'BIN') {
            if (req.file) {
                resolucion.contenido_documento_resolucion = req.file.buffer; // Usa req.file.buffer para obtener el contenido en formato binario
                resolucion.url_documento_resolucion = null; // Establece url_documento_resolucion en null
            }
        } else if (flag_adjunto === 'URL') {
            const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            const fileName = `${req.file.originalname}-${uniqueSuffix}`;
            resolucion.url_documento_resolucion = `\\resoluciones\\${fileName}`;
            resolucion.contenido_documento_resolucion = null; // Establece el contenido en formato binario en null
        }

        await resolucion.save();
        res.send('Resolución actualizada');
    } catch (error) {
        return res.status(500).json({ mensaje: error.message });
    }
}

export const autorizarResolucion = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {
      const resolucion = await Resolucion.findByPk(id);
      resolucion.autorizado = autorizado;
      resolucion.autorizado_por = autorizado_por;
      resolucion.autorizado_fecha = autorizado_fecha;
      await resolucion.save(); 
      res.send('Resolución autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}


export const eliminarResolucion = async (req, res) =>{

    try {
        const { id } = req.params
        await Resolucion.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarResolucion = async (req, res) => {
  try {
    const { id } = req.params; 

    const resolucion = await Resolucion.findByPk(id);

    if (!resolucion) {
      return res.status(404).json({ mensaje: 'Resolucion no encontrada' });
    }

    resolucion.activo = '1'; // Establecer activo en '1'
    await resolucion.save();

    res.json({ mensaje: 'Resolucion activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarResolucion = async (req, res) => {
  try {
    const { id } = req.params; 

    const resolucion = await Resolucion.findByPk(id);

    if (!resolucion) {
      return res.status(404).json({ mensaje: 'Resolucion no encontrada' });
    }

    resolucion.activo = '0'; // Establecer activo en '0'
    await resolucion.save();

    res.json({ mensaje: 'Resolucion desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};
