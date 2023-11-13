import { Sequelize } from 'sequelize';
import {OpcionesUsuario} from '../models/OpcionesUsuario.js';
import { Menu } from '../models/Menu.js';
import { CamposTablas } from '../models/CamposTablas.js';

export const buscarOpcionesUsuarios = async (req, res) => {
    const { id_usuario } = req.params; // Utiliza req.params en lugar de req.query

    try {
        if (!id_usuario) {
            return res.status(400).json({ error: true, message: 'El parámetro id_usuario es obligatorio.' });
        }

        const opcionesusuarios = await OpcionesUsuario.findAll({
            where: {
                id_usuario: id_usuario,
            },
            include: [
                {
                    model: Menu,
                    required: true,
                },
            ],
        });

        res.json(opcionesusuarios );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Error al buscar opciones de usuario.' });
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
     res.json({ mensaje: 'Opciones de usuario actualizados con éxito' });
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

