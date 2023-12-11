import { Sequelize } from 'sequelize';
import {Menu} from '../models/Menu.js';

export const buscarMenus = async (req, res) => {
  const { primer_nivel, segundo_nivel, nombre_menu, tipo_menu } = req.query;

  try {
    // Verificar si tipo_menu es "ADMINISTRADOR"
    if (tipo_menu && tipo_menu.toUpperCase() === "ADMINISTRADOR") {
      // Si es "ADMINISTRADOR", retornar todas las opciones sin filtrar
      const menus = await Menu.findAll({
        order: [['primer_nivel'], ['segundo_nivel']]
      });
      res.json(menus);
    } else {
      // Si no es "ADMINISTRADOR", aplicar los filtros normales
      const whereClause = {};

      if (primer_nivel) {
        whereClause.primer_nivel = primer_nivel;
      }

      if (segundo_nivel) {
        whereClause.segundo_nivel = segundo_nivel;
      }

      if (tipo_menu) {
        whereClause.tipo_menu = tipo_menu;
      }

      if (nombre_menu) {
        whereClause.nombre_menu = {
          [Sequelize.Op.like]: `%${nombre_menu}%`
        };
      }

      const menus = await Menu.findAll({
        where: Object.keys(whereClause).length === 0 ? {} : whereClause,
        order: [['primer_nivel'], ['segundo_nivel']]
      });

      res.json(menus);
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const leerMenu = async (req, res) =>{
    const { id } = req.params;
    try {
        const menu = await Menu.findOne({
            where:{
                id
            }
        })
        res.json(menu);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearMenu = async (req, res) =>{
    const {id_usuario, id_menu } = req.body;
    try {
        const nuevoMenu = await Menu.create({
          id_usuario,
          id_menu
        })
        res.json(nuevoMenu);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarMenu = async (req, res) =>{
    const { id } = req.params;
    const { id_usuario, id_menu } = req.body;

    try{
    const menu = await Menu.findByPk(id);
    menu.id_usuario = id_usuario;
    menu.id_menu = id_menu;
    await menu.save(); 
    res.send('Opción del usuario actualizada');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarMenu = async (req, res) =>{

    try {
        const { id } = req.params
        await Menu.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}

