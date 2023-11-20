import { Sequelize } from 'sequelize';
import {Convocatoria} from '../models/Convocatoria.js';
import { Anexo } from '../models/Anexo.js';
import { Comunicacion1 } from '../models/Comunicacion1.js';
import { Comunicacion2 } from '../models/Comunicacion2.js';
import { Comunicacion3 } from '../models/Comunicacion3.js';
import { Comunicacion } from '../models/Comunicacion.js';
import { Aviso } from '../models/Aviso.js';
import { Examen } from '../models/Examen.js';
import { Final } from '../models/Final.js';
import { Curriculo } from '../models/Curriculo.js';
import { Entrevista } from '../models/Entrevista.js';

export const obtenerPeriodos = async (req, res) => {
  try {
    const aniosUnicos = await Convocatoria.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('periodo_convocatoria')), 'periodo_convocatoria'],
      ],
      order: [[Sequelize.col('periodo_convocatoria'), 'DESC']],
    });

    // Extraer los valores de aniosUnicos
    const anios = aniosUnicos.map((anio) => anio.get('periodo_convocatoria'));

    res.json(anios);
  } catch (error) {
    console.error('Error al obtener años únicos de convocatorias:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const buscarConvocatorias = async (req, res) => {
  const { tipo_convocatoria, numero_convocatoria, periodo_convocatoria, estado_convocatoria, descripcion_convocatoria, id_area, autorizado, activo } = req.query;

  try {
    const whereClause = {};

    if (tipo_convocatoria) {
      whereClause.tipo_convocatoria = tipo_convocatoria;
    }

    if (autorizado) {
      whereClause.autorizado = autorizado;
    }

    if (id_area) {
      whereClause.id_area = id_area;
    }

    if (numero_convocatoria) {
      whereClause.numero_convocatoria = numero_convocatoria;
    }

    if (periodo_convocatoria) {
      whereClause.periodo_convocatoria = periodo_convocatoria;
    }

    if (estado_convocatoria) {
      whereClause.estado_convocatoria = estado_convocatoria;
    }

    if (descripcion_convocatoria) {
      whereClause.descripcion_convocatoria = {
        [Sequelize.Op.like]: `%${descripcion_convocatoria}%`
      };
    }

    if (activo) {
      whereClause.activo = activo;
    }

    const convocatorias = await Convocatoria.findAll({
      where: Object.keys(whereClause).length === 0 ? {} : whereClause,
      order: [
        ['periodo_convocatoria', 'DESC'],
        ['numero_convocatoria', 'DESC']
      ],
      include: [
        {
          model: Anexo,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Comunicacion1,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Comunicacion2,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Comunicacion3,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Comunicacion,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Aviso,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Curriculo,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Entrevista,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Examen,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        {
          model: Final,
          attributes: ['id', 'flag_adjunto', 'url_documento', 'contenido_documento'],
        },
        // Repite esto para cada modelo relacionado
      ],
    });

    res.json(convocatorias);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




export const leerConvocatorias = async (req, res) =>{
    try {
        const convocatorias = await Convocatoria.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(convocatorias);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const activarConvocatoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convocatoria = await Convocatoria.findByPk(id);
  
      if (!convocatoria) {
        return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
      }
  
      convocatoria.activo = '1'; // Establecer activo en '1'
      await convocatoria.save();
  
      res.json({ mensaje: 'Convocatoria activada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

  export const desactivarConvocatoria = async (req, res) => {
    try {
      const { id } = req.params; 
  
      const convocatoria = await Convocatoria.findByPk(id);
  
      if (!convocatoria) {
        return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
      }
  
      convocatoria.activo = '0'; // Establecer activo en '0'
      await convocatoria.save();
  
      res.json({ mensaje: 'Convocatoria desactivada correctamente' });
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };


export const leerConvocatoria = async (req, res) =>{
    const { id } = req.params;
    try {
        const convocatoria = await Convocatoria.findOne({
            where:{
                id
            }
        })
        res.json(convocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearConvocatoria = async (req, res) => {
    const {
        descripcion_convocatoria,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        creado_por,
        creado_fecha,
        id_area
    } = req.body;

    try {

        const convocatoriaExistente = await Convocatoria.findOne({
            tipo_convocatoria,
            numero_convocatoria,
            periodo_convocatoria
        });

        if (convocatoriaExistente) {
            return res.status(400).json({ mensaje: 'Ya existe una convocatoria con estos valores' });
        }

        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria,
            tipo_convocatoria,
            numero_convocatoria,
            periodo_convocatoria,
            estado_convocatoria,
            creado_por,
            creado_fecha,
            id_area
        });

        return res.status(201).json({ mensaje: 'Convocatoria creada con éxito', nuevaConvocatoria });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al crear convocatoria', error: error.message });
    }
};

export const actualizarConvocatoria = async (req, res) => {
    const { id } = req.params; // Suponiendo que el ID de la convocatoria se pasa como un parámetro en la URL
    const {
        descripcion_convocatoria,
        tipo_convocatoria,
        numero_convocatoria,
        periodo_convocatoria,
        estado_convocatoria,
        modificado_por,
        modificado_fecha,
        id_area
    } = req.body;

    // Lógica para manejar el almacenamiento de archivos adjuntos
    // Ejemplo: guardarArchivo('convocatorias', req.file);

    try {
        // Verificar si la convocatoria con el ID dado existe
        const convocatoriaExistente = await Convocatoria.findByPk(id);

        if (!convocatoriaExistente) {
            return res.status(404).json({ mensaje: 'Convocatoria no encontrada' });
        }

        // Verificar si ya existe otra convocatoria con la misma combinación de tipo, número y periodo
        const otraConvocatoria = await Convocatoria.findOne({
          where: {
              id: { [Op.not]: id }, // Excluir la convocatoria actual del chequeo
              tipo_convocatoria,
              numero_convocatoria,
              periodo_convocatoria
          }
        });

        if (otraConvocatoria) {
          return res.status(400).json({ mensaje: 'Ya existe otra convocatoria con estos valores' });
        }

        // Actualizar la convocatoria en la base de datos
        const [numRowsUpdated, [convocatoriaActualizada]] = await Convocatoria.update(
            {
                descripcion_convocatoria,
                tipo_convocatoria,
                numero_convocatoria,
                periodo_convocatoria,
                estado_convocatoria,
                modificado_por,
                modificado_fecha,
                id_area
            },
            {
                where: { id },
                returning: true,
            }
        );

        // Verificar si se actualizó alguna fila
        if (numRowsUpdated === 0) {
            return res.status(404).json({ mensaje: 'No se encontró la convocatoria para actualizar' });
        }

        return res.status(200).json({ mensaje: 'Convocatoria actualizada con éxito', convocatoriaActualizada });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al actualizar convocatoria', error: error.message });
    }
};


export const autorizarConvocatoria = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {

      const convocatoria = await Convocatoria.findByPk(id);
      
      convocatoria.autorizado = autorizado;
      convocatoria.autorizado_por = autorizado_por;
      convocatoria.autorizado_fecha = autorizado_fecha;
      await convocatoria.save(); 
      
      res.send('Convocatoria autorizada / desautorizada');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}

export const eliminarConvocatoria = async (req, res) =>{

    try {
        const { id } = req.params
        await Convocatoria.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message})
    }
}

