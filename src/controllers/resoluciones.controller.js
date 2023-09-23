import { Sequelize } from 'sequelize';
import {Resolucion} from '../models/Resolucion.js';

export const leerResoluciones = async (req, res) =>{
    try {
        const resoluciones = await Resolucion.findAll();
        res.json(resoluciones);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarResoluciones = async (req, res) => {
    const { periodo_resolucion, id_area, id_tipo_documento, numero_resolucion, sumilla_resolucion } = req.query;
  
    try {
      const whereClause = {};
  
      if (periodo_resolucion) {
        whereClause.periodo_resolucion = periodo_resolucion;
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
  
      const resoluciones = await Resolucion.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
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

export const crearResolucion = async (req, res) =>{
    const {periodo_resolucion, id_area, id_tipo_documento,  numero_resolucion, adicional_resolucion, sumilla_resolucion, url_documento_resolucion } = req.body;
    try {
        const nuevaResolucion = await Resolucion.create({
            periodo_resolucion, 
            id_area, 
            id_tipo_documento,  
            numero_resolucion, 
            adicional_resolucion, 
            sumilla_resolucion, 
            url_documento_resolucion
        })
        res.json(nuevaResolucion);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarResolucion = async (req, res) =>{
    const { id } = req.params;
    const { periodo_resolucion, id_area, id_tipo_documento,  numero_resolucion, adicional_resolucion, sumilla_resolucion, url_documento_resolucion, autorizado, autorizado_por, activo } = req.body;

    try {
        const resolucion = await Resolucion.findByPk(id);
        resolucion.periodo_resolucion = periodo_resolucion;
        resolucion.id_area = id_area;
        resolucion.id_tipo_documento = id_tipo_documento;
        resolucion.numero_resolucion = numero_resolucion;
        resolucion.adicional_resolucion = adicional_resolucion;
        resolucion.sumilla_resolucion = sumilla_resolucion;
        resolucion.url_documento_resolucion = url_documento_resolucion;
        resolucion.autorizado = autorizado;
        resolucion.autorizado_por = autorizado_por;
        resolucion.activo = activo;
        await resolucion.save(); 
        res.send('Resolución actualizada');
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