import { Sequelize } from 'sequelize';
import {Norma} from '../models/NormasInstitucionales.js';

export const leerNormas = async (req, res) =>{
    try {
        const normas = await Norma.findAll({
            where: {
              activo: '1', 
            },
          });
        res.json(normas);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const buscarNormas = async (req, res) => {
    const { tipo_norma, denominacion_norma } = req.query;
  
    try {
      const whereClause = {};
  
      if (tipo_norma) {
        whereClause.tipo_norma = tipo_norma;
      }
  
      if (denominacion_norma) {
        whereClause.denominacion_norma = {
          [Sequelize.Op.like]: `%${denominacion_norma}%`
        };
      }
  
      const normas = await Norma.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(normas);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerNorma = async (req, res) =>{
    const { id } = req.params;
    try {
        const norma = await Norma.findOne({
            where:{
                id
            }
        })
        res.json(norma);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearNorma = async (req, res) =>{
    const {tipo_norma, denominacion_norma, url_norma } = req.body;
    try {
        const nuevaNorma = await Norma.create({
            tipo_norma,
            denominacion_norma,
            url_norma
        })
        res.json(nuevaNorma);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarNorma = async (req, res) =>{
    const { id } = req.params;
    const { tipo_norma, denominacion_norma, url_norma, autorizado, autorizado_por, activo } = req.body;

    try{
    const norma = await Norma.findByPk(id);
    
    norma.tipo_norma = tipo_norma;
    norma.denominacion_norma = denominacion_norma;
    norma.url_norma = url_norma;
    norma.autorizado = autorizado;
    norma.autorizado_por = autorizado_por;
    norma.activo = activo;
    await norma.save(); 
    res.send('Norma actualizada');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarNorma = async (req, res) =>{

    try {
        const { id } = req.params
        await Norma.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}