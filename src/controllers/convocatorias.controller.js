import { Sequelize } from 'sequelize';
import {Convocatoria} from '../models/Convocatoria.js';

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
    const { tipo_convocatoria, numero_convocatoria, periodo_convocatoria, estado_convocatoria, descripcion_convocatoria } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_convocatoria) {
        whereClause.tipo_convocatoria = tipo_convocatoria;
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
  
      const convocatorias = await Convocatoria.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
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

export const crearConvocatoria = async (req, res) =>{
    const { descripcion_convocatoria, tipo_convocatoria, numero_convocatoria, periodo_convocatoria, url_anexos, url_comunicacion1, url_comunicacion2, url_comunicacion3, url_aviso, url_resultado_evaluacion_curricular, url_resultado_examen, url_resultado_entrevista, url_puntaje_final, estado_convocatoria } = req.body;
    try {
        const nuevaConvocatoria = await Convocatoria.create({
            descripcion_convocatoria, 
            tipo_convocatoria, 
            numero_convocatoria, 
            periodo_convocatoria, 
            url_anexos, 
            url_comunicacion1, 
            url_comunicacion2, 
            url_comunicacion3, 
            url_aviso, 
            url_resultado_evaluacion_curricular, 
            url_resultado_examen, 
            url_resultado_entrevista, 
            url_puntaje_final,
            estado_convocatoria
        })
        res.json(nuevaConvocatoria);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarConvocatoria = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_convocatoria, tipo_convocatoria, numero_convocatoria, periodo_convocatoria, url_anexos, url_comunicacion1, url_comunicacion2, url_comunicacion3, url_aviso, url_resultado_evaluacion_curricular, url_resultado_examen, url_resultado_entrevista, url_puntaje_final, estado_convocatoria, autorizado, autorizado_por, activo } = req.body;

    try {

        const convocatoria = await Convocatoria.findByPk(id);
        convocatoria.descripcion_convocatoria = descripcion_convocatoria;
        convocatoria.tipo_convocatoria = tipo_convocatoria;
        convocatoria.numero_convocatoria = numero_convocatoria;
        convocatoria.periodo_convocatoria = periodo_convocatoria;
        convocatoria.url_anexos = url_anexos;
        convocatoria.url_comunicacion1 = url_comunicacion1;
        convocatoria.url_comunicacion2 = url_comunicacion2;
        convocatoria.url_comunicacion3 = url_comunicacion3;
        convocatoria.url_aviso = url_aviso;
        convocatoria.url_resultado_evaluacion_curricular = url_resultado_evaluacion_curricular;
        convocatoria.url_resultado_examen = url_resultado_examen;
        convocatoria.url_resultado_entrevista = url_resultado_entrevista;
        convocatoria.url_puntaje_final = url_puntaje_final;
        convocatoria.estado_convocatoria = estado_convocatoria;
        convocatoria.autorizado = autorizado;
        convocatoria.autorizado_por = autorizado_por;
        convocatoria.activo = activo;

        await convocatoria.save(); 
        
        res.send('Convocatoria actualizada');
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

