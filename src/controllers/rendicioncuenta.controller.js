import {Rendicion} from '../models/Rendicionescuenta.js';

export const leerRendiciones = async (req, res) =>{
    try {
        const rendiciones = await Rendicion.findAll();
        res.json(rendiciones);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const leerRendicion = async (req, res) =>{
    const { id } = req.params;
    try {
        const rendicion = await Rendicion.findOne({
            where:{
                id
            }
        })
        res.json(rendicion);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const crearRendicion = async (req, res) =>{
    const {descripcion_rendicion, periodo_rendicion, url_rendicion } = req.body;
    try {
        const nuevaRendicion = await Rendicion.create({
            descripcion_rendicion,
            periodo_rendicion,
            url_rendicion
        })
        res.json(nuevaRendicion);
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const actualizarRendicion = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_rendicion, periodo_rendicion, url_rendicion, autorizado, autorizado_por, activo } = req.body;

    try{
    const rendicion = await Rendicion.findByPk(id);
    
    rendicion.descripcion_rendicion = descripcion_rendicion;
    rendicion.periodo_rendicion = periodo_rendicion;
    rendicion.url_rendicion = url_rendicion;
    rendicion.autorizado = autorizado;
    rendicion.autorizado_por = autorizado_por;
    rendicion.activo = activo;
    await rendicion.save(); 
    res.send('Rendición actualizada');
    }
    catch(error){
         return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarRendicion = async (req, res) =>{

    try {
        const { id } = req.params
        await Rendicion.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}