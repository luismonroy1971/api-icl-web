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
    const { tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, denominacion_servicio } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_servicio) {
        whereClause.tipo_servicio = tipo_servicio;
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
    const {tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, flag_seleccion, denominacion_servicio, por_uit, monto_soles, monto_uit } = req.body;
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
            monto_uit
        })
        res.json(nuevoServicio);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarServicio = async (req, res) =>{
    const { id } = req.params;
    const { tipo_servicio, periodo_servicio, numero_servicio, sub_nivel_servicio, flag_seleccion, denominacion_servicio, por_uit, monto_soles, monto_uit, autorizado, autorizado_por, activo } = req.body;

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
        servicio.autorizado = autorizado;
        servicio.autorizado_por = autorizado_por;
        servicio.activo = activo;
        await servicio.save(); 
        res.send('Servicio actualizado');
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
