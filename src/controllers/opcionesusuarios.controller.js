import { Sequelize } from 'sequelize';
import {OpcionesUsuario} from '../models/OpcionesUsuario.js';
import { Menu } from '../models/Menu.js';
import { CamposTablas } from '../models/CamposTablas.js';


export const buscarOpcionesUsuarios = async (req, res) => {
    const { id_usuario } = req.params;

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
                    attributes: ['id', 'primer_nivel', 'segundo_nivel', 'nombre_menu', 'etiqueta_menu', 'descripcion_menu', 'tipo_menu', 'url']
                },
            ],
            order: [
                [Menu, 'primer_nivel', 'ASC'],
                [Menu, 'segundo_nivel', 'ASC']
            ]
        });

        // Transformar los datos
        let resultado = opcionesusuarios.map(opcion => ({
            id: opcion.menu.id,
            primer_nivel: opcion.menu.primer_nivel.trim(),
            segundo_nivel: opcion.menu.segundo_nivel.trim(),
            nombre_menu: opcion.menu.nombre_menu,
            etiqueta_menu: opcion.menu.etiqueta_menu,
            descripcion_menu: opcion.menu.descripcion_menu,
            tipo_menu: opcion.menu.tipo_menu,
            url: opcion.menu.url,
        }));

        // Verificar y añadir los objetos faltantes
        const agregarSiFalta = (primerNivel, objeto) => {
            const opcionesPrimerNivel = resultado.filter(opcion => opcion.primer_nivel === primerNivel);
            if (opcionesPrimerNivel.length > 0 && !opcionesPrimerNivel.some(opcion => opcion.segundo_nivel === "0")) {
                resultado = resultado.filter(opcion => opcion.primer_nivel !== primerNivel);
                resultado.push(objeto, ...opcionesPrimerNivel);
            }
        };

        agregarSiFalta("1", {
            id: 1,
            primer_nivel: "1",
            segundo_nivel: "0",
            nombre_menu: "Opciones Generales",
            etiqueta_menu: "Generales",
            descripcion_menu: "Opciones Generales de la web",
            tipo_menu: "ADMINISTRADOR",
            url: "/generales"
        });

        agregarSiFalta("2", {
            id: 10,
            primer_nivel: "2",
            segundo_nivel: "0",
            nombre_menu: "Tablas para la Web",
            etiqueta_menu: "Web",
            descripcion_menu: "Administrador de Tablas para la Web",
            tipo_menu: "ADMINISTRADOR",
            url: "/Web"
        });

        // Reordenar el resultado final
        resultado.sort((a, b) => {
            const primerNivelA = parseInt(a.primer_nivel, 10);
            const primerNivelB = parseInt(b.primer_nivel, 10);
            
            if (primerNivelA === primerNivelB) {
                const segundoNivelA = parseInt(a.segundo_nivel, 10);
                const segundoNivelB = parseInt(b.segundo_nivel, 10);
                return segundoNivelA - segundoNivelB;
            }
            return primerNivelA - primerNivelB;
        });

        res.json(resultado);
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

