import {Area} from '../models/Area.js';

export const leerAreas = async (req, res) =>{
    try {
        const areas = await Area.findAll();
        res.json(areas);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const leerArea = async (req, res) =>{
    const { id } = req.params;
    try {
        const area = await Area.findOne({
            where:{
                id
            }
        })
        res.json(area);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }

}

export const crearArea = async (req, res) =>{
    const {descripcion_area, abreviacion_area } = req.body;
    console.log(descripcion_area, abreviacion_area)
    try {
        const nuevaArea = await Area.create({
            descripcion_area,
            abreviacion_area,
        })
        res.json(nuevaArea);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message })
    }
}

export const actualizarArea = async (req, res) =>{
    const { id } = req.params;
    const { descripcion_area, abreviacion_area, activo } = req.body;

    try{
    const area = await Area.findByPk(id);
    
    area.descripcion_area = descripcion_area;
    area.abreviacion_area = abreviacion_area;
    area.activo = activo;
    await area.save(); 
    res.send('Area actualizada');
    }
        catch(error){
        return res.status(500).json({ mensaje: error.message })
    }
}

export const eliminarArea = async (req, res) =>{

    try {
        const { id } = req.params
        await Area.destroy({
            where:{
                id,
            }
        })
        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ mensaje: error.message})
    }
}