import { Sequelize } from 'sequelize';
import {Directiva} from '../models/Directiva.js';

export const leerDirectivas = async (req, res) =>{
    try {
        const directivas = await Directiva.findAll();
        res.json(directivas);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const buscarDirectivas = async (req, res) => {
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

export const crearDirectiva = async (req, res) =>{
    const {periodo_resolucion, id_area, id_tipo_documento,  numero_resolucion, adicional_resolucion, sumilla_resolucion, url_documento_resolucion } = req.body;
    try {
        const nuevaDirectiva = await Directiva.create({
            periodo_resolucion, 
            id_area, 
            id_tipo_documento,  
            numero_resolucion, 
            adicional_resolucion, 
            sumilla_resolucion, 
            url_documento_resolucion
        })
        res.json(nuevaDirectiva);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarDirectiva = async (req, res) =>{
    const { id } = req.params;
    const { periodo_resolucion, id_area, id_tipo_documento,  numero_resolucion, adicional_resolucion, sumilla_resolucion, url_documento_resolucion, autorizado, autorizado_por, activo } = req.body;

    try {
        const directiva = await Directiva.findByPk(id);
        directiva.periodo_resolucion = periodo_resolucion;
        directiva.id_area = id_area;
        directiva.id_tipo_documento = id_tipo_documento;
        directiva.numero_resolucion = numero_resolucion;
        directiva.adicional_resolucion = adicional_resolucion;
        directiva.sumilla_resolucion = sumilla_resolucion;
        directiva.url_documento_resolucion = url_documento_resolucion;
        directiva.autorizado = autorizado;
        directiva.autorizado_por = autorizado_por;
        directiva.activo = activo;
        await directiva.save(); 
        res.send('Directiva actualizada');
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