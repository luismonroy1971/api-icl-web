import { Sequelize } from 'sequelize';
import {OpcionesUsuario} from '../models/OpcionesUsuario.js';

export const buscarOpcionesUsuarios = async (req, res) => {
    const { id_usuario } = req.query;
  
    try {
      const whereClause = {};
  
      if (id_usuario) {
        whereClause.id_usuario = id_usuario;
      }

      const opcionesusuarios = await OpcionesUsuario.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause
      });
  
      res.json(opcionesusuarios);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  

export const leerOpcionesUsuario = async (req, res) =>{
    const { id } = req.params;
    try {
        const opcionesusuario = await OpcionesUsuario.findOne({
            where:{
                id
            }
        })
        res.json(opcionesusuario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearOpcionesUsuario = async (req, res) =>{
    const {id_usuario, id_menu } = req.body;
    try {
        const nuevoOpcionesUsuario = await OpcionesUsuario.create({
          id_usuario,
          id_menu
        })
        res.json(nuevoOpcionesUsuario);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarOpcionesUsuario = async (req, res) =>{
    const { id } = req.params;
    const { id_usuario, id_menu } = req.body;

    try{
    const opcionesusuario = await OpcionesUsuario.findByPk(id);
    opcionesusuario.id_usuario = id_usuario;
    opcionesusuario.id_menu = id_menu;
    await opcionesusuario.save(); 
    res.send('Opciones del usuario actualizadas');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarOpcionesUsuario = async (req, res) =>{

    try {
        const { id } = req.params
        await OpcionesUsuario.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

