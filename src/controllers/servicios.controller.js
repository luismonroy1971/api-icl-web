import { Sequelize } from 'sequelize';
import {Servicio} from '../models/Servicio.js';

export const leerServicios = async (req, res) =>{
    try {
        const servicios = await Servicio.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(servicios);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarServicios = async (req, res) => {
    const { tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, denominacion_servicio, autorizado } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_servicio) {
        whereClause.tipo_servicio = tipo_servicio;
      }

      if (autorizado) {
        whereClause.autorizado = autorizado;
      }
  
      if (periodo_servicio) {
        whereClause.periodo_servicio = periodo_servicio;
      }
  
      if (numero_servicio) {
        whereClause.numero_servicio = numero_servicio;
      }
  
      if (sub_nivel_servicio) {
        whereClause.sub_nivel_servicio = sub_nivel_servicio;
      }
  
      if (denominacion_servicio) {
        whereClause.denominacion_servicio = {
          [Sequelize.Op.like]: `%${denominacion_servicio}%`
        };
      }

      whereClause.activo = '1';
  
      const servicios = await Servicio.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(servicios);
    } catch (error) {
      return res.status(500).json({ mensaje: error.message });
    }
  };
  

export const leerServicio = async (req, res) =>{
    const { id } = req.params;
    try {
        const servicio = await Servicio.findOne({
            where:{
                id
            }
        })
        res.json(servicio);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearServicio = async (req, res) =>{
    const {tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, flag_seleccion, denominacion_servicio, por_uit, monto_soles, monto_uit, creado_por, creado_fecha } = req.body;
    try {
        const nuevoServicio = await Servicio.create({
            tipo_servicio, 
            periodo_servicio, 
            numero_servicio, 
            sub_nivel_servicio, 
            flag_seleccion, 
            denominacion_servicio, 
            por_uit, 
            monto_soles, 
            monto_uit,
            creado_por, 
            creado_fecha
        })
        res.json(nuevoServicio);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarServicio = async (req, res) =>{
    const { id } = req.params;
    const { tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, flag_seleccion, denominacion_servicio, por_uit, monto_soles, monto_uit, modificado_por, modificado_fecha, activo } = req.body;

    try {
        const servicio = await Servicio.findByPk(id);
        servicio.tipo_servicio = tipo_servicio;
        servicio.periodo_servicio = periodo_servicio;
        servicio.numero_servicio = numero_servicio;
        servicio.sub_nivel_servicio = sub_nivel_servicio;
        servicio.flag_seleccion = flag_seleccion;
        servicio.denominacion_servicio = denominacion_servicio;
        servicio.por_uit = por_uit;
        servicio.monto_soles = monto_soles;
        servicio.monto_uit = monto_uit;
        servicio.modificado_por = modificado_por;
        servicio.modificado_fecha = modificado_fecha;
        servicio.activo = activo;
        await servicio.save(); 
        res.send('Servicio actualizado');
    }
    catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const autorizarServicio = async (req, res) =>{
  const { id } = req.params;
  const { autorizado, autorizado_por, autorizado_fecha } = req.body;

  try {
      const servicio = await Servicio.findByPk(id);
      servicio.autorizado = autorizado;
      servicio.autorizado_por = autorizado_por;
      servicio.autorizado_por = autorizado_fecha;
      await servicio.save(); 
      res.send('Servicio autorizado / desautorizado');
  }
  catch(error){
      return res.status(500).json({ mensaje: error.message })
  }
}


export const eliminarServicio = async (req, res) =>{

    try {
        const { id } = req.params
        await Servicio.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

export const activarServicio = async (req, res) => {
  try {
    const { id } = req.params; 

    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrada' });
    }

    servicio.activo = '1'; // Establecer activo en '1'
    await servicio.save();

    res.json({ mensaje: 'Servicio activada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const desactivarServicio = async (req, res) => {
  try {
    const { id } = req.params; 

    const servicio = await Servicio.findByPk(id);

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrada' });
    }

    servicio.activo = '0'; // Establecer activo en '0'
    await servicio.save();

    res.json({ mensaje: 'Servicio desactivada correctamente' });
  } catch (error) {
    return res.status(500).json({ mensaje: error.message });
  }
};


export const obtenerValorDeServicio = async (req, res) => {
  try {
    const { tipo_servicio, numero_servicio, metraje, flag_construccion, sub_nivel_servicio } = req.query;

    if (!tipo_servicio || !numero_servicio || !metraje || !flag_construccion ) {
      return res.status(400).json({ error: 'Los parámetros "tipo_servicio", "numero_servicio", "flag_construccion" y "metraje" son obligatorios.' });
    }

    // Define las condiciones iniciales para la búsqueda
    let condiciones;
    if (sub_nivel_servicio){
      condiciones = {
        tipo_servicio,
        numero_servicio,
        sub_nivel_servicio
      };  
    }
    else{
      condiciones = {
        tipo_servicio,
        numero_servicio,
        flag_calculo: '1',
      };
    }
    console.log(condiciones)
    const servicios = await Servicio.findAll({
      where: condiciones,
      attributes: ['flag_construccion', 'sub_nivel_servicio', 'flag_metraje', 'metraje_inicial', 'metraje_final', 'monto_soles'],
    });

    let valorServicio = null;

    // Itera sobre los servicios para encontrar el valor correcto

    for (const servicio of servicios) {
      if (sub_nivel_servicio){
          valorServicio = servicio.monto_soles;
          break;
      }
      if (servicio.flag_metraje === 'NO'){
          valorServicio = servicio.monto_soles;
          break;
      }
      else
      {
        const metrajeInicial = parseFloat(servicio.metraje_inicial);
        const metrajeFinal = parseFloat(servicio.metraje_final);
        if (numero_servicio > 6 ){
          if (metrajeInicial <= metraje && metraje <= metrajeFinal) {
            valorServicio = servicio.monto_soles;
            break;
            }
        }
        
        else if (servicio.flag_construccion === flag_construccion ){
          if (metrajeInicial <= metraje && metraje <= metrajeFinal) {
            valorServicio = servicio.monto_soles;
            break;
            }
        }
      
      }

    }

    if (valorServicio !== null) {
      return res.json({ valor_servicio: valorServicio });
    }

    return res.status(404).json({ error: 'No se encontró un servicio válido.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor.' });
  }
};


